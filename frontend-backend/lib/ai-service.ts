import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'

export type AIProvider = 'openai' | 'gemini'

export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AIOptions {
  provider: AIProvider
  apiKey: string
  model?: string
  maxTokens?: number
  temperature?: number
}

class AIService {
  async generateResponse(
    messages: AIMessage[],
    options: AIOptions,
    personality: string,
    knowledgeBase?: string
  ): Promise<string> {
    let { provider, maxTokens = 1000, temperature = 0.7 } = options
    let { apiKey, model } = options

    // Use environment variables as fallback
    if (!apiKey) {
      // Jika user tidak input API key, pakai Gemini 2.0 Flash default
      provider = 'gemini';
      model = 'gemini-2.0-flash';
      const fallbackKey = process.env.API_KEY_GEMINI_DEFAULT;
      if (fallbackKey) {
        apiKey = fallbackKey;
      }
    }

    if (!apiKey) {
      throw new Error(`No API key provided for ${provider}. Please configure your API key.`)
    }

    // Add system message with personality and knowledge base
    const systemMessage: AIMessage = {
      role: 'system',
      content: this.buildSystemPrompt(personality, knowledgeBase)
    }

    const fullMessages = [systemMessage, ...messages]

    try {
      switch (provider) {
        case 'openai':
          return await this.generateOpenAIResponse(fullMessages, {
            apiKey,
            model: model || 'gpt-3.5-turbo',
            maxTokens,
            temperature
          })
        case 'gemini':
          return await this.generateGeminiResponse(fullMessages, {
            apiKey,
            model: model || 'gemini-2.0-flash',
            maxTokens,
            temperature
          })
        default:
          throw new Error(`Unsupported AI provider: ${provider}`)
      }
    } catch (error: any) {
      console.error('AI Service Error:', error)
      throw new Error(this.getErrorMessage(error, provider))
    }
  }

  private buildSystemPrompt(personality: string, knowledgeBase?: string): string {
    let prompt = `You are an AI assistant with the following personality: ${personality}\n\n`
    
    if (knowledgeBase && knowledgeBase.trim()) {
      prompt += `Additional knowledge and context:\n${knowledgeBase}\n\n`
    }
    
    prompt += `Please respond according to your personality and use the provided knowledge when relevant. Be helpful, accurate, and stay in character.`
    
    return prompt
  }

  private async generateOpenAIResponse(
    messages: AIMessage[],
    options: { apiKey: string; model: string; maxTokens: number; temperature: number }
  ): Promise<string> {
    const openai = new OpenAI({
      apiKey: options.apiKey,
      dangerouslyAllowBrowser: true
    })

    const response = await openai.chat.completions.create({
      model: options.model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      max_tokens: options.maxTokens,
      temperature: options.temperature,
      stream: false
    })

    return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
  }

  private async generateGeminiResponse(
    messages: AIMessage[],
    options: { apiKey: string; model: string; maxTokens: number; temperature: number }
  ): Promise<string> {
    const genAI = new GoogleGenerativeAI(options.apiKey)
    
    // Use the correct model name format for API
    let modelName = options.model
    
    // Handle model name mapping for API compatibility
    switch (modelName) {
      case 'gemini-2.0-flash':
        modelName = 'gemini-2.0-flash-exp'
        break
      case 'gemini-pro':
        modelName = 'gemini-1.5-pro-latest' // Use latest stable version
        break
      case 'gemini-pro-vision':
        modelName = 'gemini-1.5-pro-latest'
        break
      default:
        // Keep the original name if not in our mapping
        break
    }
    
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        maxOutputTokens: options.maxTokens,
        temperature: options.temperature,
      }
    })

    // Convert messages to Gemini format
    const systemMessage = messages.find(m => m.role === 'system')
    const conversationHistory = messages.filter(m => m.role !== 'system')
    
    // Build the conversation history for Gemini
    const history = conversationHistory.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))

    const lastMessage = conversationHistory[conversationHistory.length - 1]
    const prompt = systemMessage 
      ? `${systemMessage.content}\n\nUser: ${lastMessage.content}`
      : lastMessage.content

    try {
      if (history.length > 0) {
        // Use chat for multi-turn conversations
        const chat = model.startChat({ history })
        const result = await chat.sendMessage(prompt)
        const response = await result.response
        return response.text()
      } else {
        // Use generateContent for single messages
        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text()
      }
    } catch (error: any) {
      // If the specific model fails, try with fallback model
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        try {
          console.log(`Model ${modelName} not available, trying fallback...`)
          const fallbackModel = genAI.getGenerativeModel({ 
            model: 'gemini-1.5-flash-latest',
            generationConfig: {
              maxOutputTokens: options.maxTokens,
              temperature: options.temperature,
            }
          })
          
          const result = await fallbackModel.generateContent(prompt)
          const response = await result.response
          return response.text()
        } catch (fallbackError) {
          throw new Error(`Both primary and fallback models failed. ${error.message}`)
        }
      }
      throw error
    }
  }

  private getErrorMessage(error: any, provider: AIProvider): string {
    if (error.message?.includes('API key')) {
      return `Invalid or missing API key for ${provider}. Please check your API key and try again.`
    }
    
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return `${provider} API quota exceeded. Please check your usage limits or try again later.`
    }
    
    if (error.message?.includes('network') || error.message?.includes('timeout')) {
      return `Network error connecting to ${provider}. Please check your internet connection and try again.`
    }
    
    return `Error generating response from ${provider}: ${error.message || 'Unknown error'}`
  }

  // Method to validate API key
  async validateApiKey(provider: AIProvider, apiKey: string): Promise<boolean> {
    try {
      const testMessages: AIMessage[] = [
        { role: 'user', content: 'Hello' }
      ]
      
      await this.generateResponse(testMessages, {
        provider,
        apiKey,
        maxTokens: 10,
        temperature: 0.1
      }, 'Test assistant')
      
      return true
    } catch (error) {
      return false
    }
  }

  // Get available models for each provider
  getAvailableModels(provider: AIProvider): string[] {
    switch (provider) {
      case 'openai':
        return [
          'gpt-4',
          'gpt-4-turbo',
          'gpt-3.5-turbo',
          'gpt-3.5-turbo-16k'
        ]
      case 'gemini':
        return [
          'gemini-2.0-flash',
          'gemini-1.5-pro',
          'gemini-1.5-flash'
        ]
      default:
        return []
    }
  }
}

export const aiService = new AIService()
