import { NextRequest, NextResponse } from 'next/server'
import { aiService, type AIMessage } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      message, 
      agentId, 
      personality, 
      knowledgeBase, 
      apiKey, 
      aiProvider = 'openai',
      aiModel,
      maxTokens = 1000, 
      temperature = 0.7,
      conversationHistory = []
    } = body

    // Validation
    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!personality?.trim()) {
      return NextResponse.json(
        { error: 'Agent personality is required' },
        { status: 400 }
      )
    }

    // Check if API key is provided for the selected provider
    let finalApiKey = apiKey;
    let finalProvider = aiProvider;
    let finalModel = aiModel;
    if (!apiKey?.trim()) {
      finalProvider = 'gemini';
      finalModel = 'gemini-2.0-flash';
      finalApiKey = process.env.API_KEY_GEMINI_DEFAULT;
    }

    // Build conversation history
    const messages: AIMessage[] = [
      ...conversationHistory.map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ]

    // Generate AI response
    if (!finalApiKey) {
      return NextResponse.json({
        response: generateFallbackResponse(message, personality)
      })
    }
    const response = await aiService.generateResponse(
      messages,
      {
        provider: finalProvider,
        apiKey: finalApiKey,
        model: finalModel,
        maxTokens,
        temperature
      },
      personality,
      knowledgeBase?.content
    )

    return NextResponse.json({ response })

  } catch (error: any) {
    console.error('Chat API Error:', error)
    
    // Return error message to client
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate response',
        fallbackResponse: generateFallbackResponse(
          'Hello', 
          'I apologize, but I encountered an error. Please check your API key and try again.'
        )
      },
      { status: 500 }
    )
  }
}

function generateFallbackResponse(message: string, personality: string): string {
  const fallbackResponses = [
    `Thank you for your message. As an AI assistant with this personality: "${personality}", I would love to help you, but I need a valid API key to provide intelligent responses. Try using Gemini 2.0 Flash for enhanced performance!`,
    `I understand you're asking about: "${message}". Based on my personality setting: "${personality}", I'd be happy to assist, but please configure an API key first. Gemini 2.0 Flash offers great multimodal capabilities.`,
    `Your message has been received. With my current personality: "${personality}", I aim to be helpful, but I require an API key to access AI capabilities like Gemini 2.0 Flash or OpenAI models.`,
    `I appreciate your inquiry. Given my personality: "${personality}", I want to provide you with the best response possible, but I need an API key to utilize advanced AI models.`,
    `Thank you for reaching out. My personality is set to: "${personality}", and I'd love to help you with your request once you provide an API key for models like Gemini 2.0 Flash.`
  ]
  
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Chat API is working',
    supportedProviders: ['openai', 'gemini'],
    latestModels: {
      openai: 'gpt-4-turbo',
      gemini: 'gemini-2.0-flash'
    }
  })
}
