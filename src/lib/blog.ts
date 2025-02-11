import { db } from './firebase';
import { collection, doc, getDoc, getDocs, query, where, orderBy, addDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { BlogPost } from '../types/blog';

const BLOG_COLLECTION = 'blog_posts';

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    console.log('Starting getBlogPosts query...');
    const blogQuery = query(
      collection(db, BLOG_COLLECTION),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );

    console.log('Executing Firestore query...');
    const snapshot = await getDocs(blogQuery);
    console.log('Query returned', snapshot.size, 'documents');
    
    const posts = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Processing document:', doc.id, data);
      try {
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as BlogPost;
      } catch (err) {
        console.error('Error processing document:', doc.id, err);
        return null;
      }
    }).filter(Boolean) as BlogPost[];
    
    console.log('Processed posts:', posts);
    return posts;
  } catch (error: any) {
    console.error('Detailed error in getBlogPosts:', {
      error,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw new Error('Failed to fetch blog posts');
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const blogQuery = query(
      collection(db, BLOG_COLLECTION),
      where('slug', '==', slug),
      where('published', '==', true)
    );

    const snapshot = await getDocs(blogQuery);
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
      updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
    } as BlogPost;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw new Error('Failed to fetch blog post');
  }
}

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, BLOG_COLLECTION), {
      ...post,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw new Error('Failed to create blog post');
  }
}

export async function updateBlogPost(id: string, post: Partial<Omit<BlogPost, 'id' | 'createdAt'>>): Promise<void> {
  try {
    const docRef = doc(db, BLOG_COLLECTION, id);
    await updateDoc(docRef, {
      ...post,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw new Error('Failed to update blog post');
  }
} 