'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { createBlogPost, getBlogPosts, deleteBlogPost } from '@/lib/blog';
import { BlogPost } from '@/types/blog';

export default function AdminBlogPage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [slug, setSlug] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      try {
        const blogPosts = await getBlogPosts();
        setPosts(blogPosts);
      } catch (error: any) {
        console.error('Error loading blog posts:', error);
      }
    }
    loadPosts();
  }, []);

  const makeAdmin = async () => {
    try {
      const response = await fetch('/api/make-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.uid }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSuccess(true);
        alert('Admin access granted successfully!');
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Starting blog post submission...');

      // Basic validation
      if (!title || !content || !excerpt) {
        throw new Error('Please fill in all required fields');
      }

      console.log('Content validation:', {
        title: title.length > 0,
        content: content.length > 0,
        excerpt: excerpt.length > 0,
        contentLength: content.length,
        contentStart: content.substring(0, 50)
      });

      // Extract FAQ data before creating post
      const faqMatch = content.match(/<script\s+type="application\/json"\s+id="faq-data">([\s\S]*?)<\/script>/);
      
      console.log('FAQ extraction attempt:', {
        faqTagFound: Boolean(faqMatch),
        matchPosition: faqMatch?.index,
        matchContent: faqMatch ? faqMatch[1].substring(0, 100) : 'No match found'
      });

      if (faqMatch) {
        try {
          const faqData = JSON.parse(faqMatch[1]);
          console.log('FAQ data parsed successfully:', faqData);
        } catch (error) {
          console.error('Failed to parse FAQ JSON:', error);
          console.log('Failed JSON string:', faqMatch[1]);
        }
      }

      console.log('Creating blog post...');
      const postId = await createBlogPost({
        title,
        content,
        excerpt,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt,
        seoKeywords: seoKeywords.split(',').map(k => k.trim()),
        author: user.displayName || 'Anonymous Oracle',
        published: true
      });

      console.log('Blog post created successfully:', { postId });
      setSuccess(true);
      router.push(`/blog/${slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError(error instanceof Error ? error.message : 'Failed to create blog post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }
    
    try {
      await deleteBlogPost(postId);
      setPosts(posts.filter(post => post.id !== postId));
      alert('Blog post deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting blog post:', error);
      alert('Failed to delete blog post. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-black text-white">
        <div>Please sign in to access the admin panel.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 p-4 bg-purple-900/50 border border-purple-700 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Your User Information</h2>
          <p className="mb-2">User ID: {user.uid}</p>
          <button
            onClick={makeAdmin}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Make Me Admin
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Create Blog Post</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-900/50 border border-green-500 rounded-lg text-green-200">
            Blog post created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-purple-900/50 border border-purple-700 rounded-lg text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Content (HTML)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 p-2 bg-purple-900/50 border border-purple-700 rounded-lg text-white font-mono"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full h-20 p-2 bg-purple-900/50 border border-purple-700 rounded-lg text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Slug (optional)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full p-2 bg-purple-900/50 border border-purple-700 rounded-lg text-white"
              placeholder="Will be generated from title if left empty"
            />
          </div>

          <div>
            <label className="block mb-2">SEO Title (optional)</label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full p-2 bg-purple-900/50 border border-purple-700 rounded-lg text-white"
              placeholder="Will use main title if left empty"
            />
          </div>

          <div>
            <label className="block mb-2">SEO Description (optional)</label>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="w-full h-20 p-2 bg-purple-900/50 border border-purple-700 rounded-lg text-white"
              placeholder="Will use excerpt if left empty"
            />
          </div>

          <div>
            <label className="block mb-2">SEO Keywords (comma-separated)</label>
            <input
              type="text"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              className="w-full p-2 bg-purple-900/50 border border-purple-700 rounded-lg text-white"
              placeholder="oracle, mystical, wisdom"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Blog Post'}
          </button>
        </form>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Existing Blog Posts</h2>
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl">{post.title}</h3>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-sm text-purple-300 mt-2">{post.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 