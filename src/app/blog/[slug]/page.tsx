import { Metadata } from 'next';
import { getBlogPostBySlug } from '@/lib/blog';
import BlogPostClient from './BlogPostClient';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | Oracle Path',
      description: 'The mystical scroll you seek does not exist...',
    };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;

  return {
    title,
    description,
    keywords: post.seoKeywords,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author],
      images: [{
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-default.png'],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  return <BlogPostClient initialPost={post} />;
} 