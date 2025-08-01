import { create } from "zustand"
import { persist } from "zustand/middleware"
import { AgentService } from "./agent-service"

export interface Agent {
  id: string
  name: string
  personality: string
  personalityType: "custom" | "friendly" | "professional" | "technical" | "creative" | "formal"
  knowledgeBase: {
    type: "manual" | "document" | "url"
    content: string
    fileName?: string
    url?: string
  }
  apiKey?: string
  aiProvider?: "openai" | "gemini"
  aiModel?: string
  maxTokens: number
  temperature: number
  status: "active" | "inactive"
  chatCount: number
  createdAt: Date
}

export interface User {
  address: string
  displayName?: string
  email?: string
  avatar?: string
  subscription: "free" | "premium"
  balance: number
}

interface AppState {
  user: User | null
  agents: Agent[]
  isConnected: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setConnected: (connected: boolean) => void
  loadAgents: () => Promise<void>
  addAgent: (agent: Omit<Agent, "id" | "createdAt" | "chatCount">) => Promise<Agent | null>
  updateAgent: (id: string, updates: Partial<Agent>) => Promise<Agent | null>
  deleteAgent: (id: string) => Promise<boolean>
  incrementChatCount: (agentId: string) => Promise<boolean>
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      agents: [],
      isConnected: false,
      isLoading: false,
      setUser: (user) => set({ user }),
      setConnected: (connected) => set({ isConnected: connected }),
      loadAgents: async () => {
        set({ isLoading: true })
        try {
          const agents = await AgentService.getAgents()
          set({ agents })
        } catch (error) {
          console.error('Error loading agents:', error)
        } finally {
          set({ isLoading: false })
        }
      },
      addAgent: async (agentData) => {
        try {
          const newAgent = await AgentService.createAgent(agentData)
          if (newAgent) {
            set((state) => ({ agents: [newAgent, ...state.agents] }))
          }
          return newAgent
        } catch (error) {
          console.error('Error adding agent:', error)
          throw error // Re-throw to allow calling code to handle
        }
      },
      updateAgent: async (id, updates) => {
        try {
          const updatedAgent = await AgentService.updateAgent(id, updates)
          if (updatedAgent) {
            set((state) => ({
              agents: state.agents.map((agent) => (agent.id === id ? updatedAgent : agent)),
            }))
          }
          return updatedAgent
        } catch (error) {
          console.error('Error updating agent:', error)
          return null
        }
      },
      deleteAgent: async (id) => {
        try {
          const success = await AgentService.deleteAgent(id)
          if (success) {
            set((state) => ({
              agents: state.agents.filter((agent) => agent.id !== id),
            }))
          }
          return success
        } catch (error) {
          console.error('Error deleting agent:', error)
          return false
        }
      },
      incrementChatCount: async (agentId) => {
        try {
          const success = await AgentService.incrementChatCount(agentId)
          if (success) {
            set((state) => ({
              agents: state.agents.map((agent) =>
                agent.id === agentId ? { ...agent, chatCount: agent.chatCount + 1 } : agent,
              ),
            }))
          }
          return success
        } catch (error) {
          console.error('Error incrementing chat count:', error)
          return false
        }
      },
    }),
    {
      name: "ai-agent-storage",
      partialize: (state) => ({ user: state.user, isConnected: state.isConnected }),
    },
  ),
)
