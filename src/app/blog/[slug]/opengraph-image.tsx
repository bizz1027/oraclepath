import { ImageResponse } from 'next/server';
import { getBlogPostBySlug } from '@/lib/blog';

export const runtime = 'edge';
export const alt = 'Oracle Path Blog';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom, #2D1B69, #000000)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: '60px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px',
            background: 'linear-gradient(to right, #A78BFA, #EC4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Oracle Path
        </div>
        <div
          style={{
            color: 'white',
            fontSize: '40px',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          {post?.title || 'Mystical Insights & Divine Wisdom'}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
} 