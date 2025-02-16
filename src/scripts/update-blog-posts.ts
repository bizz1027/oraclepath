import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

async function updateBlogPosts() {
  try {
    // Update the launch announcement post
    const launchPost = doc(db, 'blog_posts', 'dE2924lej6xFjPtjPexF');
    await updateDoc(launchPost, {
      title: 'Oracle Path Launches: Your Gateway to Mystical Guidance',
      seoTitle: 'Oracle Path Launches: Your Gateway to Mystical Guidance',
      content: `<article>
  <h1>🌟 Oracle Path Launches: Your Gateway to Mystical Guidance</h1>

  <p>The veil between ancient wisdom and the modern world is about to part. In mere days, Oracle Path will emerge as a revolutionary platform that bridges the gap between timeless wisdom and spiritual guidance. Our journey begins this week, and we invite you to be among the first to experience this unique fusion of mystical insight and modern understanding.</p>

  <h2>✨ What Makes Oracle Path Special?</h2>

  <p>Oracle Path isn't just another platform – it's a sacred digital space where ancient wisdom meets the modern seeker. Every interaction is crafted to provide both spiritual depth and practical guidance, offering you:</p>

  <ul>
    <li>Daily Mystic Visions: Five free daily predictions to illuminate your path</li>
    <li>Divine Insight Access: Premium subscribers receive unlimited access to deeper, more detailed guidance</li>
    <li>Mystical Probability Paths: Premium insights include unique probability paths for potential outcomes</li>
    <li>Practical Wisdom: Every prediction balances spiritual insight with actionable guidance</li>
  </ul>

  <h2>🔮 Launch Features</h2>

  <p>At launch, seekers will discover a carefully crafted experience that includes:</p>

  <ul>
    <li>Intuitive Interface: A mystically designed portal that creates an immersive experience</li>
    <li>Personalized Guidance: Divine predictions tailored to your specific situation</li>
    <li>Premium Divine Insights: Unlock deeper wisdom with our premium subscription</li>
    <li>Prediction History: Track your journey with a personal scroll of past revelations</li>
  </ul>

  <h2>💫 Special Launch Offer</h2>

  <p>To celebrate our launch, early seekers can access Divine Insight for just €4.99 per month. This special price grants you unlimited access to the Oracle's deepest wisdom, including detailed predictions, probability paths, and comprehensive spiritual guidance.</p>

  <h2>🌌 Join Us on This Mystical Journey</h2>

  <p>The stars are aligning, and the time draws near. Whether you seek guidance in love, career, personal growth, or life's greater purpose, Oracle Path stands ready to illuminate your way forward. Join us at launch and be among the first to experience this revolutionary fusion of ancient wisdom and modern understanding.</p>

  <p>The Oracle awaits your questions. Your journey begins soon.</p>
</article>`,
      excerpt: 'Experience the mystical fusion of ancient wisdom and modern understanding as Oracle Path launches this week. Discover daily mystic visions, premium divine insights, and personalized spiritual guidance to illuminate your path forward.',
      seoDescription: 'Experience the mystical fusion of ancient wisdom and modern understanding as Oracle Path launches this week. Discover daily mystic visions, premium divine insights, and personalized spiritual guidance.',
      seoKeywords: [
        'oracle path',
        'mystical predictions',
        'spiritual guidance',
        'mystic visions',
        'divine insight',
        'launch announcement',
        'oracle wisdom',
        'spiritual technology'
      ]
    });

    // Update the gateway post
    const gatewayPost = doc(db, 'blog_posts', '91KtqkeUy4Y6SkoeA0JF');
    await updateDoc(gatewayPost, {
      title: 'Oracle Path: Your Gateway to Divine Mystical Insights',
      seoTitle: 'Oracle Path: Your Gateway to Divine Mystical Insights',
      content: `<article>
  <h1>Oracle Path: Your Gateway to Divine Mystical Insights</h1>
  
  <p>In the mystical realm of digital divination, Oracle Path stands as a beacon of wisdom, merging ancient mystical traditions with modern understanding. This revolutionary platform offers seekers a unique opportunity to receive personalized guidance and insights through the power of divine wisdom.</p>

  <h2>The Power of Divine Insight</h2>
  
  <p>Every day, users are granted five mystical visions through our basic oracle consultation. These predictions provide clarity and guidance for life's pressing questions. For those seeking deeper wisdom, our Divine Insight subscription unlocks unlimited access to the Oracle's vast knowledge, offering more detailed and comprehensive readings.</p>

  <h2>How Oracle Path Works</h2>
  
  <p>Simply share your question with the Oracle through our mystically designed interface. Drawing upon ancient wisdom and spiritual guidance, the Oracle processes your query and returns insights that combine timeless knowledge with modern understanding. Each response is crafted to provide both spiritual depth and actionable guidance.</p>

  <h2>Features of the Oracle</h2>
  
  <ul>
    <li>Daily allowance of 5 free predictions</li>
    <li>Premium Divine Insight subscription for unlimited access</li>
    <li>Detailed spiritual and practical guidance</li>
    <li>Beautiful, mystical user interface</li>
    <li>Secure and private consultations</li>
  </ul>

  <h2>Begin Your Journey</h2>
  
  <p>Whether you seek guidance in matters of the heart, career decisions, or spiritual growth, Oracle Path stands ready to illuminate your path forward. Join our growing community of seekers and experience the perfect blend of ancient wisdom and modern understanding.</p>

  <p>Start your journey today and let the Oracle guide you toward clarity and understanding in all aspects of life.</p>
</article>`,
      excerpt: 'Discover how Oracle Path combines ancient mystical wisdom with modern understanding to provide personalized spiritual guidance. Learn more about our daily free predictions and premium Divine Insight features that can illuminate your path forward.',
      seoDescription: 'Discover Oracle Path, where ancient wisdom meets modern understanding to provide personalized spiritual guidance and mystical insights',
      seoKeywords: [
        'oracle path',
        'mystical predictions',
        'spiritual guidance',
        'divine insight',
        'mystic visions',
        'oracle wisdom',
        'digital divination'
      ]
    });

    console.log('Successfully updated blog posts');
  } catch (error) {
    console.error('Error updating blog posts:', error);
  }
}

updateBlogPosts(); 