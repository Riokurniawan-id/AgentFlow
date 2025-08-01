import { supabase } from './supabase'
import { Agent } from './store'

export class AgentService {
  // Get all agents
  static async getAgents(): Promise<Agent[]> {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return data?.map(agent => ({
        id: agent.id,
        name: agent.name,
        personality: agent.personality,
        personalityType: agent.personality_type,
        knowledgeBase: agent.knowledge_base,
        apiKey: agent.api_key,
        aiProvider: agent.ai_provider,
        aiModel: agent.ai_model,
        maxTokens: agent.max_tokens,
        temperature: agent.temperature,
        status: agent.status,
        chatCount: agent.chat_count,
        createdAt: new Date(agent.created_at)
      })) || []
    } catch (error) {
      console.error('Error fetching agents:', error)
      return []
    }
  }

  // Get agent by ID
  static async getAgentById(id: string): Promise<Agent | null> {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      if (!data) return null

      return {
        id: data.id,
        name: data.name,
        personality: data.personality,
        personalityType: data.personality_type,
        knowledgeBase: data.knowledge_base,
        apiKey: data.api_key,
        aiProvider: data.ai_provider,
        aiModel: data.ai_model,
        maxTokens: data.max_tokens,
        temperature: data.temperature,
        status: data.status,
        chatCount: data.chat_count,
        createdAt: new Date(data.created_at)
      }
    } catch (error) {
      console.error('Error fetching agent:', error)
      return null
    }
  }

  // Create new agent
  static async createAgent(agentData: Omit<Agent, 'id' | 'createdAt' | 'chatCount'>): Promise<Agent | null> {
    try {
      console.log('Creating agent with data:', agentData)
      
      const { data, error } = await supabase
        .from('agents')
        .insert({
          name: agentData.name,
          personality: agentData.personality,
          personality_type: agentData.personalityType,
          knowledge_base: agentData.knowledgeBase,
          api_key: agentData.apiKey,
          ai_provider: agentData.aiProvider,
          ai_model: agentData.aiModel,
          max_tokens: agentData.maxTokens,
          temperature: agentData.temperature,
          status: agentData.status || 'active',
          chat_count: 0
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase error creating agent:', error)
        throw error
      }

      if (!data) {
        console.error('No data returned from Supabase insert')
        throw new Error('No data returned from database insert')
      }

      console.log('Agent created successfully:', data)

      return {
        id: data.id,
        name: data.name,
        personality: data.personality,
        personalityType: data.personality_type,
        knowledgeBase: data.knowledge_base,
        apiKey: data.api_key,
        aiProvider: data.ai_provider,
        aiModel: data.ai_model,
        maxTokens: data.max_tokens,
        temperature: data.temperature,
        status: data.status,
        chatCount: data.chat_count,
        createdAt: new Date(data.created_at)
      }
    } catch (error) {
      console.error('Error creating agent:', error)
      throw error // Re-throw to allow calling code to handle
    }
  }

  // Update agent
  static async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent | null> {
    try {
      const updateData: any = {}
      
      if (updates.name) updateData.name = updates.name
      if (updates.personality) updateData.personality = updates.personality
      if (updates.personalityType) updateData.personality_type = updates.personalityType
      if (updates.knowledgeBase) updateData.knowledge_base = updates.knowledgeBase
      if (updates.apiKey !== undefined) updateData.api_key = updates.apiKey
      if (updates.aiProvider) updateData.ai_provider = updates.aiProvider
      if (updates.aiModel) updateData.ai_model = updates.aiModel
      if (updates.maxTokens) updateData.max_tokens = updates.maxTokens
      if (updates.temperature) updateData.temperature = updates.temperature
      if (updates.status) updateData.status = updates.status
      if (updates.chatCount !== undefined) updateData.chat_count = updates.chatCount

      const { data, error } = await supabase
        .from('agents')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        name: data.name,
        personality: data.personality,
        personalityType: data.personality_type,
        knowledgeBase: data.knowledge_base,
        apiKey: data.api_key,
        aiProvider: data.ai_provider,
        aiModel: data.ai_model,
        maxTokens: data.max_tokens,
        temperature: data.temperature,
        status: data.status,
        chatCount: data.chat_count,
        createdAt: new Date(data.created_at)
      }
    } catch (error) {
      console.error('Error updating agent:', error)
      return null
    }
  }

  // Delete agent
  static async deleteAgent(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id)

      if (error) throw error

      return true
    } catch (error) {
      console.error('Error deleting agent:', error)
      return false
    }
  }

  // Increment chat count
  static async incrementChatCount(id: string): Promise<boolean> {
    try {
      // First get the current chat count
      const { data: currentAgent, error: fetchError } = await supabase
        .from('agents')
        .select('chat_count')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      // Then update with incremented value
      const { error: updateError } = await supabase
        .from('agents')
        .update({ 
          chat_count: (currentAgent?.chat_count || 0) + 1
        })
        .eq('id', id)

      if (updateError) throw updateError

      return true
    } catch (error) {
      console.error('Error incrementing chat count:', error)
      return false
    }
  }
} 