'use client';

import Link from 'next/link';
import { BlogPost } from '@/types/blog';

export default function BlogPostClient({ initialPost }: { initialPost: BlogPost | null }) {
  if (!initialPost) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 to-black text-white">
        <h1 className="text-2xl mb-4">✨ The mystical scroll you seek does not exist...</h1>
        <Link
          href="/blog"
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          Return to the Archives
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/blog"
          className="inline-block mb-8 text-purple-400 hover:text-purple-300 transition-colors"
        >
          ← Back to Archives
        </Link>

        <article className="bg-black/30 rounded-lg p-8 shadow-xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              {initialPost.title}
            </h1>
            <div className="flex justify-between items-center text-sm text-purple-400">
              <span>{initialPost.author}</span>
              <span>{initialPost.createdAt.toLocaleDateString()}</span>
            </div>
          </header>

          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-purple-300
              prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6
              prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4
              prose-h3:text-xl prose-h3:font-medium prose-h3:mb-3
              prose-p:text-gray-200 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-purple-400 prose-a:no-underline hover:prose-a:text-purple-300
              prose-strong:text-purple-300 prose-strong:font-semibold
              prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
              prose-li:text-gray-200 prose-li:mb-2
              prose-blockquote:border-l-4 prose-blockquote:border-purple-500
              prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-300
              prose-code:text-purple-300 prose-code:bg-black/30 prose-code:px-1 prose-code:rounded
              prose-pre:bg-black/40 prose-pre:p-4 prose-pre:rounded-lg
              prose-img:rounded-lg prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: initialPost.content }}
          />
        </article>
      </div>
    </div>
  );
} 