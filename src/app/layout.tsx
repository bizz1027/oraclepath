import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import BrowserCheck from '../components/BrowserCheck';

const inter = Inter({ subsets: ['latin'] });

const baseUrl = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000' 
  : (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.oracle-path.com');

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Oracle Path - Where Mystical Insight Meets Divine Guidance',
    template: '%s | Oracle Path'
  },
  description: 'Experience personalized spiritual guidance through mystical predictions. Receive daily oracle readings and divine insights to illuminate your path forward.',
  keywords: [
    'oracle readings',
    'mystical predictions',
    'spiritual guidance',
    'divine insights',
    'daily oracle readings',
    'personalized predictions',
    'mystical wisdom',
    'spiritual guide',
    'oracle readings',
    'future insights'
  ],
  authors: [{ name: 'Oracle Path' }],
  creator: 'Oracle Path',
  publisher: 'Oracle Path',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Oracle Path',
    title: 'Oracle Path - Where Mystical Insight Meets Divine Guidance',
    description: 'Experience personalized spiritual guidance through mystical predictions. Receive daily oracle readings and divine insights to illuminate your path forward.',
    images: [
      {
        url: '/og-image.jpg', // Make sure to add this image to your public folder
        width: 1200,
        height: 630,
        alt: 'Oracle Path - Where Mystical Insight Meets Divine Guidance',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oracle Path - Where Mystical Insight Meets Divine Guidance',
    description: 'Experience personalized spiritual guidance through mystical predictions. Receive daily oracle readings and divine insights.',
    images: ['/twitter-image.jpg'], // Make sure to add this image to your public folder
    creator: '@oraclepath',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={baseUrl} />
        <meta name="theme-color" content="#2D1B69" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function setVH() {
                  let vh = window.innerHeight * 0.01;
                  document.documentElement.style.setProperty('--vh', vh + 'px');
                }
                
                setVH();
                window.addEventListener('resize', setVH);
                window.addEventListener('orientationchange', setVH);
                
                try {
                  if (typeof window !== 'undefined') {
                    var userAgent = window.navigator.userAgent.toLowerCase();
                    if (userAgent.includes('tiktok')) {
                      var currentPath = window.location.pathname;
                      if (currentPath === '/' || currentPath === '/login') {
                        window.location.href = '/browser-check';
                      }
                    }
                  }
                } catch (e) {
                  console.error('Browser detection error:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <BrowserCheck>{children}</BrowserCheck>
      </body>
    </html>
  );
} 