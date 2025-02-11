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
} 