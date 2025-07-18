import { create } from "zustand"
import { persist } from "zustand/middleware"

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
  setUser: (user: User | null) => void
  setConnected: (connected: boolean) => void
  addAgent: (agent: Omit<Agent, "id" | "createdAt" | "chatCount">) => void
  updateAgent: (id: string, updates: Partial<Agent>) => void
  deleteAgent: (id: string) => void
  incrementChatCount: (agentId: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      agents: [
        {
          id: "1",
          name: "Customer Support Bot",
          personality: "Friendly and helpful customer service assistant",
          personalityType: "friendly",
          knowledgeBase: {
            type: "manual",
            content:
              "I am a customer support assistant trained to help with common inquiries, product information, and troubleshooting.",
          },
          aiProvider: "openai",
          aiModel: "gpt-3.5-turbo",
          maxTokens: 1000,
          temperature: 0.7,
          status: "active",
          chatCount: 156,
          createdAt: new Date("2024-01-15"),
        },
        {
          id: "2",
          name: "Code Assistant",
          personality: "Expert programming assistant specializing in web development",
          personalityType: "technical",
          knowledgeBase: {
            type: "manual",
            content:
              "I am a programming expert with deep knowledge of JavaScript, React, Node.js, and modern web development practices.",
          },
          aiProvider: "gemini",
          aiModel: "gemini-1.5-pro",
          maxTokens: 2000,
          temperature: 0.3,
          status: "active",
          chatCount: 89,
          createdAt: new Date("2024-01-20"),
        },
      ],
      isConnected: false,
      setUser: (user) => set({ user }),
      setConnected: (connected) => set({ isConnected: connected }),
      addAgent: (agentData) => {
        const newAgent: Agent = {
          ...agentData,
          id: Date.now().toString(),
          createdAt: new Date(),
          chatCount: 0,
        }
        set((state) => ({ agents: [...state.agents, newAgent] }))
      },
      updateAgent: (id, updates) =>
        set((state) => ({
          agents: state.agents.map((agent) => (agent.id === id ? { ...agent, ...updates } : agent)),
        })),
      deleteAgent: (id) =>
        set((state) => ({
          agents: state.agents.filter((agent) => agent.id !== id),
        })),
      incrementChatCount: (agentId) =>
        set((state) => ({
          agents: state.agents.map((agent) =>
            agent.id === agentId ? { ...agent, chatCount: agent.chatCount + 1 } : agent,
          ),
        })),
    }),
    {
      name: "ai-agent-storage",
    },
  ),
)
