"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, Send, User } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { ProtectedRoute } from "@/components/protected-route"

interface Message {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
}

function ChatContent() {
  const { agents, incrementChatCount } = useAppStore()
  const [selectedAgentId, setSelectedAgentId] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const selectedAgent = agents.find((agent) => agent.id === selectedAgentId)
  const activeAgents = agents.filter((agent) => agent.status === "active")

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: "smooth",
          block: "end",
          inline: "nearest"
        });
      }, 100);
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedAgent || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage("")
    setIsLoading(true)

    try {
      // Prepare conversation history for API
      const conversationHistory = messages.map(msg => ({
        sender: msg.sender,
        content: msg.content
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          agentId: selectedAgent.id,
          personality: selectedAgent.personality,
          knowledgeBase: selectedAgent.knowledgeBase,
          apiKey: selectedAgent.apiKey,
          aiProvider: selectedAgent.aiProvider || 'openai',
          aiModel: selectedAgent.aiModel,
          maxTokens: selectedAgent.maxTokens,
          temperature: selectedAgent.temperature,
          conversationHistory
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "agent",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, agentMessage])
      incrementChatCount(selectedAgent.id)

    } catch (error: any) {
      console.error('Chat error:', error)
      
      // Show fallback response on error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I apologize, but I encountered an error: ${error.message}. Please check your API key configuration and try again.`,
        sender: "agent",
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4 sm:px-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Chat Test</h1>
        <p className="text-gray-600 dark:text-gray-300">Test your AI agents in real-time conversations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Agent</CardTitle>
          <div className="w-full sm:max-w-xs">
            <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an agent to test" />
              </SelectTrigger>
              <SelectContent>
                {activeAgents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      {agent.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {selectedAgent ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <Card className="h-[600px] sm:h-[700px] flex flex-col">
              <CardHeader className="border-b flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{selectedAgent.name}</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Active • {selectedAgent.chatCount} total chats
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                <ScrollArea className="flex-1 min-h-0 chat-scroll-area">
                  <div className="p-4 space-y-4 chat-container">
                    {messages.length === 0 && (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                        <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Start a conversation with {selectedAgent.name}</p>
                        <p className="text-sm mt-2">Type a message below to begin testing</p>
                      </div>
                    )}

                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-2 sm:gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.sender === "agent" && (
                          <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                            <AvatarFallback>
                              <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={`max-w-[85%] sm:max-w-[70%] rounded-lg px-3 sm:px-4 py-2 ${
                            message.sender === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                          }`}
                        >
                          <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === "user" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>

                        {message.sender === "user" && (
                          <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                            <AvatarFallback>
                              <User className="h-3 w-3 sm:h-4 sm:w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="border-t p-4 flex-shrink-0">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                    />
                    <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoading}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 order-1 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Agent Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Personality</p>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{selectedAgent.personality}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">AI Provider</p>
                    <p className="text-gray-600 dark:text-gray-300 capitalize">
                      {selectedAgent.aiProvider || 'OpenAI'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Model</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {selectedAgent.aiModel || 'Default'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Max Tokens</p>
                    <p className="text-gray-600 dark:text-gray-300">{selectedAgent.maxTokens}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Temperature</p>
                    <p className="text-gray-600 dark:text-gray-300">{selectedAgent.temperature}</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">API Key</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedAgent.apiKey ? '••••••••' : 'Not configured (fallback mode)'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Chat Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Chats:</span>
                  <span className="font-medium">{selectedAgent.chatCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Session:</span>
                  <span className="font-medium">{messages.filter((m) => m.sender === "user").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bot className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select an Agent to Start Testing</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Choose one of your active agents from the dropdown above to begin a conversation
            </p>
            {activeAgents.length === 0 && (
              <p className="text-sm text-gray-400 mt-2">You need to create and activate at least one agent first</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatContent />
    </ProtectedRoute>
  )
}
