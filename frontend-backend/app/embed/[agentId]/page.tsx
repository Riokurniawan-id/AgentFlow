"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, Send, User, Minimize2 } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useSearchParams } from "next/navigation"

interface Message {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
}

export default function EmbedChatPage({ params }: { params: { agentId: string } }) {
  const { agents } = useAppStore()
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get URL parameters
  const theme = searchParams.get("theme") || "light"
  const showHeader = searchParams.get("header") !== "false"
  const primaryColor = `#${searchParams.get("color") || "3b82f6"}`

  const agent = agents.find((a) => a.id === params.agentId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !agent || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(
      () => {
        const responses = [
          "Hello! I'm here to help you. How can I assist you today?",
          "That's a great question! Let me provide you with some information.",
          "I understand what you're looking for. Here's what I can tell you...",
          "Thank you for reaching out! I'm happy to help with that.",
          "Based on my knowledge, I would recommend the following approach...",
        ]

        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `${responses[Math.floor(Math.random() * responses.length)]} ${agent.personality ? `(Personality: ${agent.personality})` : ""}`,
          sender: "agent",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, agentMessage])
        setIsLoading(false)
      },
      1000 + Math.random() * 2000,
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!agent) {
    return (
      <div
        className={`flex items-center justify-center h-full ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
      >
        <div className="text-center">
          <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Agent not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Header */}
      {showHeader && (
        <div
          className={`border-b p-4 ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback style={{ backgroundColor: primaryColor, color: "white" }}>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{agent.name}</h3>
                <p className="text-xs opacity-75">Online</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="opacity-50 hover:opacity-100">
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 opacity-75">
              <Bot className="h-8 w-8 mx-auto mb-3" style={{ color: primaryColor }} />
              <p className="text-sm font-medium">Hi! I'm {agent.name}</p>
              <p className="text-xs mt-1">How can I help you today?</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "agent" && (
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarFallback style={{ backgroundColor: primaryColor, color: "white" }}>
                    <Bot className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  message.sender === "user"
                    ? `text-white`
                    : theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-900"
                }`}
                style={message.sender === "user" ? { backgroundColor: primaryColor } : {}}
              >
                <p className="break-words">{message.content}</p>
                <p className={`text-xs mt-1 opacity-75 ${message.sender === "user" ? "text-white" : ""}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              {message.sender === "user" && (
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarFallback className={theme === "dark" ? "bg-gray-700" : "bg-gray-300"}>
                    <User className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2 justify-start">
              <Avatar className="h-6 w-6">
                <AvatarFallback style={{ backgroundColor: primaryColor, color: "white" }}>
                  <Bot className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <div className={`rounded-lg px-3 py-2 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
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

      {/* Input */}
      <div
        className={`border-t p-4 ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}
      >
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className={theme === "dark" ? "bg-gray-700 border-gray-600" : ""}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            style={{ backgroundColor: primaryColor }}
            className="text-white hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs opacity-50 mt-2 text-center">Powered by AgentFlow</p>
      </div>
    </div>
  )
}
