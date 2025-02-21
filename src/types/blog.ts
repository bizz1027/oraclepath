export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSection {
  title: string;
  items: FAQItem[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  faqs?: FAQSection[]; // Optional array of FAQ sections
} 