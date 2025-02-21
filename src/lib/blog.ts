import { db } from './firebase';
import { collection, doc, getDoc, getDocs, query, where, orderBy, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { BlogPost, FAQSection } from '../types/blog';

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

function extractFAQData(content: string): { content: string; faqs?: FAQSection[] } {
  console.log('Starting FAQ extraction...', {
    contentLength: content.length,
    hasScriptTag: content.includes('<script'),
    hasCorrectScriptTag: content.includes('type="application/json" id="faq-data"'),
    scriptTagPosition: content.indexOf('<script')
  });

  // First, find the script tag with a more precise pattern
  const scriptTagRegex = /<script\s+type="application\/json"\s+id="faq-data"\s*>([\s\S]*?)<\/script>/i;
  const match = content.match(scriptTagRegex);

  if (!match) {
    console.log('No FAQ script tag found:', {
      scriptTagsInContent: content.match(/<script[^>]*>/g),
      contentPreview: content.substring(0, 200)
    });
    return { content };
  }

  try {
    // Get the JSON string and clean it up
    const jsonString = match[1].trim();
    console.log('Found FAQ JSON data:', {
      jsonLength: jsonString.length,
      jsonPreview: jsonString.substring(0, 100),
      matchStart: match.index ?? -1,
      matchEnd: (match.index ?? 0) + match[0].length
    });

    // Parse the JSON
    const jsonData = JSON.parse(jsonString);
    console.log('Parsed FAQ data structure:', {
      hasFaqs: Boolean(jsonData.faqs),
      isArray: Array.isArray(jsonData.faqs),
      numberOfSections: jsonData.faqs?.length,
      firstSection: jsonData.faqs?.[0]?.title
    });

    if (!jsonData.faqs || !Array.isArray(jsonData.faqs)) {
      console.log('Invalid FAQ data structure:', JSON.stringify(jsonData, null, 2));
      return { content };
    }

    // Remove the script tag from content
    const cleanContent = content.replace(scriptTagRegex, '').trim();
    console.log('Content cleaned:', {
      originalLength: content.length,
      cleanedLength: cleanContent.length,
      difference: content.length - cleanContent.length
    });
    
    // Validate FAQ structure
    const validatedFaqs = jsonData.faqs.map((section: any) => ({
      title: section.title || 'Untitled Section',
      items: (section.items || []).map((item: any) => ({
        question: item.question || 'Untitled Question',
        answer: item.answer || 'No answer provided'
      }))
    }));

    console.log('FAQ validation complete:', {
      numberOfSections: validatedFaqs.length,
      totalQuestions: validatedFaqs.reduce((sum: number, section: { items: any[] }) => sum + section.items.length, 0)
    });

    return {
      content: cleanContent,
      faqs: validatedFaqs as FAQSection[]
    };
  } catch (error) {
    console.error('Error processing FAQ data:', error);
    console.log('Failed JSON string:', match[1]);
    return { content };
  }
}

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    console.log('Starting blog post creation with content length:', post.content.length);
    
    // Extract FAQ data
    const { content, faqs } = extractFAQData(post.content);
    
    console.log('FAQ extraction result:', {
      hasExtractedFAQs: Boolean(faqs),
      numberOfFAQs: faqs?.length,
      contentLength: content.length
    });

    // Create the document
    const docRef = await addDoc(collection(db, BLOG_COLLECTION), {
      ...post,
      content,
      faqs,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log('Blog post created with FAQs:', {
      postId: docRef.id,
      hasFAQs: Boolean(faqs),
      numberOfFAQs: faqs?.length
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
    const updateData = { ...post };
    
    if (post.content) {
      const { content, faqs } = extractFAQData(post.content);
      updateData.content = content;
      updateData.faqs = faqs;
    }
    
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw new Error('Failed to update blog post');
  }
}

export async function deleteBlogPost(id: string): Promise<void> {
  try {
    const docRef = doc(db, BLOG_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw new Error('Failed to delete blog post');
  }
} 