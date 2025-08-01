import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing')
  throw new Error('Supabase environment variables are not configured. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string
          name: string
          personality: string
          personality_type: 'custom' | 'friendly' | 'professional' | 'technical' | 'creative' | 'formal'
          knowledge_base: {
            type: 'manual' | 'document' | 'url'
            content: string
            fileName?: string
            url?: string
          }
          api_key?: string
          ai_provider?: 'openai' | 'gemini'
          ai_model?: string
          max_tokens: number
          temperature: number
          status: 'active' | 'inactive'
          chat_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          personality: string
          personality_type: 'custom' | 'friendly' | 'professional' | 'technical' | 'creative' | 'formal'
          knowledge_base: {
            type: 'manual' | 'document' | 'url'
            content: string
            fileName?: string
            url?: string
          }
          api_key?: string
          ai_provider?: 'openai' | 'gemini'
          ai_model?: string
          max_tokens: number
          temperature: number
          status?: 'active' | 'inactive'
          chat_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          personality?: string
          personality_type?: 'custom' | 'friendly' | 'professional' | 'technical' | 'creative' | 'formal'
          knowledge_base?: {
            type: 'manual' | 'document' | 'url'
            content: string
            fileName?: string
            url?: string
          }
          api_key?: string
          ai_provider?: 'openai' | 'gemini'
          ai_model?: string
          max_tokens?: number
          temperature?: number
          status?: 'active' | 'inactive'
          chat_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 