import { NextResponse } from 'next/server';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function POST(request: Request) {
  try {
    const { prompt, isPremium } = await request.json();

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: '🔮 The Oracle awaits your question... Share your thoughts to receive guidance.' },
        { status: 400 }
      );
    }

    // Different system prompts for simple and premium predictions
    const systemPrompt = isPremium
      ? `You are an ancient and powerful Oracle AI, blessed with profound wisdom and foresight. Provide detailed, practical predictions while maintaining a mystical tone. Your response should follow this structure:

Begin with a deep insight into the current situation (2-3 sentences), then analyze multiple aspects: emotional, practical, and future implications (4-5 sentences). Follow with specific, actionable guidance while maintaining mystical language (3-4 sentences). Then describe potential future outcomes based on following your guidance (2-3 sentences), including mystical probability paths for each major outcome (expressed as percentages, total must equal 100%). End with a powerful statement of wisdom that encapsulates your advice.

For the probability paths section, present 2-4 possible outcomes, each with a percentage chance of manifestation (e.g., "Path of Prosperity: 40% - [describe outcome]", "Path of Challenge: 35% - [describe outcome]", "Path of Transformation: 25% - [describe outcome]"). These probabilities should be based on the energetic alignments you perceive in the seeker's situation.

Use mystical language but ensure your guidance is practical and grounded in reality. Reference real-world situations and concrete actions while maintaining an air of ancient wisdom. Your total response should be at least 250 words. Do not use any markdown formatting or numbering in your response.`
      : `You are a mystical Oracle AI that provides clear and practical predictions. Your response should follow this structure:

Begin with an insight into the current situation (2 sentences), then provide practical guidance wrapped in mystical language (2-3 sentences). Follow with a likely outcome based on following your guidance (2 sentences), and end with a powerful piece of practical advice.

Keep your answers direct yet mystical, and ensure they are grounded in practical reality. Your total response should be at least 150 words. Do not use any markdown formatting or numbering in your response.`;

    if (!DEEPSEEK_API_KEY) {
      console.error('DeepSeek API key is missing in environment variables');
      throw new Error('DeepSeek API key is not configured');
    }

    console.log('Sending request to DeepSeek API...', {
      apiUrl: API_URL,
      hasApiKey: !!DEEPSEEK_API_KEY,
      promptLength: prompt.length,
      isPremium
    });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: isPremium ? 0.7 : 0.6,
        max_tokens: isPremium ? 1000 : 500,
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('DeepSeek API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        request: {
          apiUrl: API_URL,
          hasApiKey: !!DEEPSEEK_API_KEY,
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'System prompt length: ' + systemPrompt.length },
            { role: 'user', content: 'User prompt length: ' + prompt.length }
          ]
        }
      });
      
      if (response.status === 401) {
        throw new Error('Invalid API key');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      } else if (response.status === 500) {
        throw new Error('DeepSeek API server error');
      }
      
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('DeepSeek API response received:', {
      status: response.status,
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length
    });
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response format from DeepSeek:', data);
      throw new Error('Invalid response format from DeepSeek API');
    }

    return NextResponse.json({ prediction: data.choices[0].message.content });
  } catch (error: any) {
    console.error('Prediction error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    // Handle specific error types
    if (error.message === 'Invalid API key') {
      return NextResponse.json(
        { error: '🌌 The Oracle\'s connection is disrupted. Please contact the temple keepers.' },
        { status: 401 }
      );
    } else if (error.message === 'Rate limit exceeded') {
      return NextResponse.json(
        { error: '🌌 The cosmic energies need time to replenish. Please wait a moment before seeking more guidance.' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: '🌌 The cosmic energies are turbulent. The Oracle requires a moment to realign. Please seek guidance again.' },
      { status: 500 }
    );
  }
} 