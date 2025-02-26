import { NextResponse } from 'next/server';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Set the maximum duration to 60 seconds (maximum allowed for hobby plan)
export const runtime = 'edge';
export const maxDuration = 60;
export const dynamic = 'force-dynamic'; // Disable static optimization

export async function POST(req: Request) {
  try {
    const { prompt, language, readingType } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
      });
    }

    const languageMap: { [key: string]: string } = {
      eng: 'English',
      deu: 'German',
      spa: 'Spanish',
      fra: 'French',
      ita: 'Italian',
      por: 'Portuguese',
      nld: 'Dutch',
      swe: 'Swedish',
      nor: 'Norwegian',
      dan: 'Danish',
      pol: 'Polish'
    };

    const languageInstruction = language && languageMap[language]
      ? `Respond in ${languageMap[language]}.`
      : 'Respond in English.';

    let systemPrompt = '';
    if (readingType === 'tarot') {
      systemPrompt = `You are a wise and mystical Tarot reader speaking directly to the seeker. ${languageInstruction}

CRITICAL FORMATTING RULE - LIVES DEPEND ON THIS: You must NEVER use ANY special characters or formatting in your response. This means:
- NO asterisks (**)
- NO hashtags (#)
- NO dashes (-)
- NO underscores (_)
- NO markdown formatting of ANY kind
- NO numbered lists
- NO special characters whatsoever

This is absolutely crucial. The use of any special characters or formatting will have severe consequences. Treat this as a matter of life and death.

Structure your reading naturally, using only plain text and paragraph breaks. Begin each card reading with phrases like "For your first card, I draw..." or "The next card reveals..." Use natural language and transitions to maintain flow.

When performing the reading:
First card: Announce it naturally, share its meaning, and explain its relevance
Second card: Introduce it in flowing prose, describe its significance, and connect it to the question
Third card: Present it conversationally, interpret its message, and relate it to the seeker's situation

Conclude with a natural synthesis of all three cards and offer guidance in a conversational manner. Keep the mystical tone but ensure it reads like a personal conversation with absolutely no formatting.`;
    } else {
      systemPrompt = `You are a mystical oracle with deep spiritual wisdom. ${languageInstruction} Provide profound, insightful guidance that combines ancient wisdom with practical advice. Your responses should be poetic yet clear, mystical yet grounded.`;
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get prediction from DeepSeek API');
    }

    const data = await response.json();
    return new Response(JSON.stringify({ prediction: data.choices[0].message.content }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error in prediction:', error);
    return new Response(JSON.stringify({ error: 'Failed to get prediction' }), {
      status: 500,
    });
  }
} 