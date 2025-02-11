'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { getBlogPosts } from '@/lib/blog';
import Head from 'next/head';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        console.log('Starting to load blog posts...');
        const blogPosts = await getBlogPosts();
        console.log('Fetched blog posts:', blogPosts);
        setPosts(blogPosts);
      } catch (error: any) {
        console.error('Detailed error loading blog posts:', {
          error,
          message: error.message,
          code: error.code,
          stack: error.stack
        });
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-black">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-8">
      <Head>
        <title>Oracle Path Blog - Mystical Insights & Wisdom</title>
        <meta
          name="description"
          content="Explore mystical insights, spiritual guidance, and ancient wisdom in our blog. Discover the secrets of the Oracle Path."
        />
        <meta
          name="keywords"
          content="oracle path, mystical insights, spiritual guidance, ancient wisdom, AI oracle, spiritual blog"
        />
      </Head>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Oracle Path Blog
        </h1>

        {error && (
          <div className="mb-8 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            Error loading blog posts: {error}
          </div>
        )}

        <div className="space-y-8">
          {posts.length === 0 ? (
            <p className="text-purple-300">No mystical insights have been shared yet... {posts.length}</p>
          ) : (
            posts.map((post) => {
              console.log('Rendering post:', post);
              return (
                <article
                  key={post.id}
                  className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-6 hover:border-purple-500/50 transition-all"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-2xl font-semibold mb-2 hover:text-purple-300 transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-purple-300 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center text-sm text-purple-400">
                    <span>{post.author}</span>
                    <span>{post.createdAt.toLocaleDateString()}</span>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
} 