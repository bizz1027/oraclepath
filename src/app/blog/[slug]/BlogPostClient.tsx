'use client';

import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamically import the BlogCalculators component
const BlogCalculators = dynamic(() => import('@/components/BlogCalculators'), {
  loading: () => (
    <div className="w-full h-32 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

// FAQ Accordion Component
function FAQSection({ title, items }: { title: string; items: { question: string; answer: string }[] }) {
  return (
    <div className="space-y-4 bg-purple-900/20 p-6 rounded-lg border border-purple-600/30 my-8">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <FAQItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-purple-700/30 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center text-left bg-purple-800/30 hover:bg-purple-800/40 transition-colors"
      >
        <span className="font-medium">{question}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[1000px]' : 'max-h-0'
        }`}
      >
        <div className="p-4 bg-purple-900/20 text-purple-200">
          {answer}
        </div>
      </div>
    </div>
  );
}

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

  // Process the content to handle special components and FAQs
  const processContent = () => {
    let content = initialPost.content;
    let faqs: FAQSection[] | null = null;
    
    // Extract FAQs
    const startTag = '<script type="application/json" id="faq-data">';
    const endTag = '</script>';
    const startIndex = content.indexOf(startTag);
    const endIndex = content.indexOf(endTag, startIndex);
    
    if (startIndex !== -1 && endIndex !== -1) {
      try {
        const jsonString = content.substring(startIndex + startTag.length, endIndex);
        const faqData = JSON.parse(jsonString);
        if (faqData.faqs) {
          faqs = faqData.faqs;
          // Remove the script tag from content
          content = content.slice(0, startIndex) + content.slice(endIndex + endTag.length);
        }
      } catch (error) {
        console.error('Error parsing FAQ data:', error);
      }
    }

    // Split content at BlogCalculators tag
    const parts = content.split('<BlogCalculators />');
    
    return (
      <>
        {parts.length > 1 ? (
          <>
            <div dangerouslySetInnerHTML={{ __html: parts[0] }} />
            <BlogCalculators />
            <div dangerouslySetInnerHTML={{ __html: parts[1] }} />
          </>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        )}
        
        {faqs && faqs.length > 0 && (
          <div className="mt-12 space-y-8">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            {faqs.map((section: FAQSection, index: number) => (
              <div key={index} className="bg-purple-900/20 p-6 rounded-lg border border-purple-600/30">
                <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                <div className="space-y-4">
                  {section.items.map((item: FAQItem, itemIndex: number) => (
                    <FAQItem 
                      key={itemIndex} 
                      question={item.question} 
                      answer={item.answer} 
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

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
          >
            {processContent()}
          </div>
        </article>
      </div>
    </div>
  );
} 