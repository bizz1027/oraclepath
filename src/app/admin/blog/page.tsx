'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { createBlogPost } from '@/lib/blog';

export default function AdminBlogPage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!user) {
        throw new Error('You must be logged in to create a blog post');
      }

      console.log('Creating blog post with data:', {
        title,
        excerpt,
        slug,
        author: user.displayName,
      });

      const blogPost = {
        title,
        content,
        excerpt,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        author: user.displayName || 'Anonymous Oracle',
        published: true,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt,
        seoKeywords: seoKeywords.split(',').map(k => k.trim()),
      };

      console.log('Attempting to create blog post...');
      const postId = await createBlogPost(blogPost);
      console.log('Blog post created successfully with ID:', postId);
      
      setSuccess(true);
      alert('Blog post created successfully!');
      
      // Clear form
      setTitle('');
      setContent('');
      setExcerpt('');
      setSlug('');
      setSeoTitle('');
      setSeoDescription('');
      setSeoKeywords('');
    } catch (error: any) {
      console.error('Detailed error creating blog post:', {
        error,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      setError(error.message || 'Failed to create blog post. Please make sure you are an admin.');
    } finally {
      setIsLoading(false);
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
      </div>
    </div>
  );
} 