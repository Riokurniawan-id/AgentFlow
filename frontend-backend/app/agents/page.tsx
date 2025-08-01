"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Bot,
  Plus,
  Edit,
  Trash2,
  MessageSquare,
  Calendar,
  Code,
  Copy,
  Check,
  Send,
  User,
  Minimize2,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { useToast } from "@/hooks/use-toast"

interface EmbedCodeGeneratorProps {
  agent: {
    id: string
    name: string
    personality: string
  }
}

function EmbedCodeGenerator({ agent }: EmbedCodeGeneratorProps) {
  const { toast } = useToast()
  const [embedConfig, setEmbedConfig] = useState({
    width: "400",
    height: "600",
    theme: "light",
    position: "bottom-right",
    showHeader: true,
    primaryColor: "#3b82f6",
  })
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [previewMessages, setPreviewMessages] = useState([
    {
      id: "1",
      content: `Hi! I'm ${agent.name}. How can I help you today?`,
      sender: "agent" as const,
      timestamp: new Date(),
    },
    {
      id: "2",
      content: "Hello! I'd like to know more about your services.",
      sender: "user" as const,
      timestamp: new Date(),
    },
    {
      id: "3",
      content: "I'd be happy to help you with that! Let me provide you with some information about our services.",
      sender: "agent" as const,
      timestamp: new Date(),
    },
  ])

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://your-app.com"

  const generateIframeCode = () => {
    const params = new URLSearchParams({
      theme: embedConfig.theme,
      header: embedConfig.showHeader.toString(),
      color: embedConfig.primaryColor.replace("#", ""),
    })

    return `<iframe 
  src="${baseUrl}/embed/${agent.id}?${params.toString()}"
  width="${embedConfig.width}"
  height="${embedConfig.height}"
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
  title="${agent.name} Chatbot">
</iframe>`
  }

  const generateFloatingWidgetCode = () => {
    return `<!-- ${agent.name} Floating Chat Widget -->
<div id="ai-chat-widget-${agent.id}"></div>
<script>
  (function() {
    var widget = document.createElement('div');
    widget.innerHTML = \`
      <div style="
        position: fixed;
        ${embedConfig.position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"}
        ${embedConfig.position.includes("right") ? "right: 20px;" : "left: 20px;"}
        z-index: 9999;
        width: ${embedConfig.width}px;
        height: ${embedConfig.height}px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        overflow: hidden;
        display: none;
      " id="chat-widget-container">
        <iframe 
          src="${baseUrl}/embed/${agent.id}?theme=${embedConfig.theme}&header=${embedConfig.showHeader}&color=${embedConfig.primaryColor.replace("#", "")}"
          width="100%"
          height="100%"
          frameborder="0"
          title="${agent.name} Chatbot">
        </iframe>
      </div>
      <button style="
        position: fixed;
        ${embedConfig.position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"}
        ${embedConfig.position.includes("right") ? "right: 20px;" : "left: 20px;"}
        z-index: 10000;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: ${embedConfig.primaryColor};
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
      " onclick="toggleChatWidget()" id="chat-widget-button">
        💬
      </button>
    \`;
    document.body.appendChild(widget);
    
    window.toggleChatWidget = function() {
      var container = document.getElementById('chat-widget-container');
      var button = document.getElementById('chat-widget-button');
      if (container.style.display === 'none') {
        container.style.display = 'block';
        button.innerHTML = '✕';
      } else {
        container.style.display = 'none';
        button.innerHTML = '💬';
      }
    };
  })();
</script>`
  }

  const generateReactCode = () => {
    return `import React from 'react';

const ${agent.name.replace(/\s+/g, "")}Chatbot = () => {
  return (
    <iframe
      src="${baseUrl}/embed/${agent.id}?theme=${embedConfig.theme}&header=${embedConfig.showHeader}&color=${embedConfig.primaryColor.replace("#", "")}"
      width="${embedConfig.width}"
      height="${embedConfig.height}"
      style={{
        border: 'none',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
      title="${agent.name} Chatbot"
    />
  );
};

export default ${agent.name.replace(/\s+/g, "")}Chatbot;`
  }

  const copyToClipboard = async (code: string, type: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(type)
      toast({
        title: "Code Copied!",
        description: `${type} code has been copied to clipboard.`,
      })
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy code to clipboard.",
        variant: "destructive",
      })
    }
  }

  const ChatPreview = () => {
    const isDark = embedConfig.theme === "dark"

    return (
      <div
        className="flex flex-col overflow-hidden"
        style={{
          width: `${Math.min(Number.parseInt(embedConfig.width), 400)}px`,
          height: `${Math.min(Number.parseInt(embedConfig.height), 500)}px`,
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        {embedConfig.showHeader && (
          <div
            className="border-b p-3 flex items-center justify-between"
            style={{
              borderColor: isDark ? "#374151" : "#e5e7eb",
              backgroundColor: isDark ? "#111827" : "#f9fafb",
            }}
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback style={{ backgroundColor: embedConfig.primaryColor, color: "white" }}>
                  <Bot className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-medium" style={{ color: isDark ? "#ffffff" : "#111827" }}>
                  {agent.name}
                </h3>
                <p className="text-xs" style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                  Online
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Minimize2 className="h-3 w-3" style={{ color: isDark ? "#9ca3af" : "#6b7280" }} />
            </Button>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-3">
            {previewMessages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "agent" && (
                  <Avatar className="h-5 w-5 flex-shrink-0">
                    <AvatarFallback style={{ backgroundColor: embedConfig.primaryColor, color: "white" }}>
                      <Bot className="h-2.5 w-2.5" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className="max-w-[75%] rounded-lg px-2.5 py-1.5 text-xs"
                  style={
                    message.sender === "user"
                      ? { backgroundColor: embedConfig.primaryColor, color: "white" }
                      : {
                          backgroundColor: isDark ? "#374151" : "#f3f4f6",
                          color: isDark ? "#ffffff" : "#111827",
                        }
                  }
                >
                  <p className="break-words leading-relaxed">{message.content}</p>
                  <p
                    className="text-xs mt-1 opacity-75"
                    style={{
                      color: message.sender === "user" ? "rgba(255,255,255,0.8)" : isDark ? "#9ca3af" : "#6b7280",
                    }}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>

                {message.sender === "user" && (
                  <Avatar className="h-5 w-5 flex-shrink-0">
                    <AvatarFallback style={{ backgroundColor: isDark ? "#374151" : "#e5e7eb" }}>
                      <User className="h-2.5 w-2.5" style={{ color: isDark ? "#9ca3af" : "#6b7280" }} />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div
          className="border-t p-3"
          style={{
            borderColor: isDark ? "#374151" : "#e5e7eb",
            backgroundColor: isDark ? "#111827" : "#f9fafb",
          }}
        >
          <div className="flex gap-2">
            <div
              className="flex-1 px-3 py-2 rounded-md text-xs"
              style={{
                backgroundColor: isDark ? "#374151" : "#ffffff",
                border: `1px solid ${isDark ? "#4b5563" : "#d1d5db"}`,
                color: isDark ? "#d1d5db" : "#6b7280",
              }}
            >
              Type your message...
            </div>
            <Button size="sm" className="h-8 w-8 p-0" style={{ backgroundColor: embedConfig.primaryColor }}>
              <Send className="h-3 w-3 text-white" />
            </Button>
          </div>
          <p className="text-xs text-center mt-2 opacity-50" style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
            Powered by AgentFlow
          </p>
        </div>
      </div>
    )
  }

  const FloatingPreview = () => {
    const [isOpen, setIsOpen] = useState(false)
    const isDark = embedConfig.theme === "dark"

    return (
      <div className="relative">
        {/* Simulated webpage background */}
        <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 relative overflow-hidden">
          <div className="space-y-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>

          <p className="absolute top-4 left-6 text-sm text-gray-600 dark:text-gray-400 font-medium">
            Your Website Content
          </p>

          {/* Floating Chat Widget */}
          {isOpen && (
            <div
              className="absolute shadow-2xl"
              style={{
                [embedConfig.position.includes("bottom") ? "bottom" : "top"]: "20px",
                [embedConfig.position.includes("right") ? "right" : "left"]: "20px",
                width: `${Math.min(Number.parseInt(embedConfig.width), 300)}px`,
                height: `${Math.min(Number.parseInt(embedConfig.height), 400)}px`,
                borderRadius: "12px",
                overflow: "hidden",
                zIndex: 10,
              }}
            >
              <ChatPreview />
            </div>
          )}

          {/* Floating Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-white text-lg"
            style={{
              [embedConfig.position.includes("bottom") ? "bottom" : "top"]: "20px",
              [embedConfig.position.includes("right") ? "right" : "left"]: "20px",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: embedConfig.primaryColor,
              border: "none",
              cursor: "pointer",
              zIndex: 11,
            }}
          >
            {isOpen ? "✕" : "💬"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
          <Code className="h-4 w-4" />
          <span className="sm:hidden ml-2">Embed</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Embed Code Generator - {agent.name}
          </DialogTitle>
          <DialogDescription>Generate embed codes to integrate your AI agent into any website</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Configuration</h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="width" className="text-sm">
                    Width
                  </Label>
                  <Input
                    id="width"
                    value={embedConfig.width}
                    onChange={(e) => setEmbedConfig((prev) => ({ ...prev, width: e.target.value }))}
                    placeholder="400"
                  />
                </div>
                <div>
                  <Label htmlFor="height" className="text-sm">
                    Height
                  </Label>
                  <Input
                    id="height"
                    value={embedConfig.height}
                    onChange={(e) => setEmbedConfig((prev) => ({ ...prev, height: e.target.value }))}
                    placeholder="600"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="theme" className="text-sm">
                  Theme
                </Label>
                <select
                  id="theme"
                  value={embedConfig.theme}
                  onChange={(e) => setEmbedConfig((prev) => ({ ...prev, theme: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div>
                <Label htmlFor="position" className="text-sm">
                  Position (for floating widget)
                </Label>
                <select
                  id="position"
                  value={embedConfig.position}
                  onChange={(e) => setEmbedConfig((prev) => ({ ...prev, position: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                </select>
              </div>

              <div>
                <Label htmlFor="primaryColor" className="text-sm">
                  Primary Color
                </Label>
                <Input
                  id="primaryColor"
                  type="color"
                  value={embedConfig.primaryColor}
                  onChange={(e) => setEmbedConfig((prev) => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-full h-10"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showHeader"
                  checked={embedConfig.showHeader}
                  onChange={(e) => setEmbedConfig((prev) => ({ ...prev, showHeader: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="showHeader" className="text-sm">
                  Show Header
                </Label>
              </div>
            </div>
          </div>

          {/* Code Tabs */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="iframe" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="iframe">HTML Iframe</TabsTrigger>
                <TabsTrigger value="floating">Floating Widget</TabsTrigger>
                <TabsTrigger value="react">React Component</TabsTrigger>
              </TabsList>

              <TabsContent value="iframe" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">HTML Iframe Embed</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generateIframeCode(), "HTML Iframe")}
                    className="bg-transparent"
                  >
                    {copiedCode === "HTML Iframe" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    Copy
                  </Button>
                </div>
                <Textarea value={generateIframeCode()} readOnly className="font-mono text-sm h-32" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Simple iframe embed - paste this code directly into your HTML
                </p>
              </TabsContent>

              <TabsContent value="floating" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Floating Chat Widget</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generateFloatingWidgetCode(), "Floating Widget")}
                    className="bg-transparent"
                  >
                    {copiedCode === "Floating Widget" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    Copy
                  </Button>
                </div>
                <Textarea value={generateFloatingWidgetCode()} readOnly className="font-mono text-sm h-48" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Floating chat button that opens the chatbot when clicked
                </p>
              </TabsContent>

              <TabsContent value="react" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">React Component</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generateReactCode(), "React Component")}
                    className="bg-transparent"
                  >
                    {copiedCode === "React Component" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    Copy
                  </Button>
                </div>
                <Textarea value={generateReactCode()} readOnly className="font-mono text-sm h-40" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  React component for easy integration into React applications
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Preview */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Live Preview</h3>

          <Tabs defaultValue="iframe-preview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="iframe-preview">Iframe Preview</TabsTrigger>
              <TabsTrigger value="floating-preview">Floating Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="iframe-preview" className="mt-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <div className="flex justify-center">
                  <ChatPreview />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="floating-preview" className="mt-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <FloatingPreview />
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
                  Click the chat button to see the floating widget in action
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Integration Instructions</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Copy the generated code and paste it into your website's HTML</li>
            <li>• The chatbot will automatically connect to your AI agent</li>
            <li>• Customize the appearance using the configuration options</li>
            <li>• For React apps, use the React component for better integration</li>
            <li>• The floating widget is perfect for customer support scenarios</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AgentsContent() {
  const { agents, deleteAgent, updateAgent, loadAgents, isLoading } = useAppStore()
  const { toast } = useToast()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Load agents on component mount
  useEffect(() => {
    loadAgents()
  }, [loadAgents])

  const handleDelete = (id: string) => {
    deleteAgent(id)
    setDeletingId(null)
    toast({
      title: "Agent deleted",
      description: "The agent has been successfully deleted.",
    })
  }

  const toggleStatus = (id: string, currentStatus: "active" | "inactive") => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    updateAgent(id, { status: newStatus })
    toast({
      title: "Status updated",
      description: `Agent is now ${newStatus}.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Agents</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your AI agents and their configurations</p>
        </div>
        <Link href="/create-agent">
          <Button className="flex items-center gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Create New Agent
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bot className="h-12 w-12 text-gray-400 mb-4 animate-pulse" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Loading agents...</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-6 px-4">
              Please wait while we fetch your agents
            </p>
          </CardContent>
        </Card>
      ) : agents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bot className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No agents yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-6 px-4">
              Create your first AI agent to get started with automated conversations
            </p>
            <Link href="/create-agent">
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Agent
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {agents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                  </div>
                  <Badge variant={agent.status === "active" ? "default" : "secondary"}>{agent.status}</Badge>
                </div>
                <CardDescription className="line-clamp-2">{agent.personality}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{agent.chatCount} chats</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(agent.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <div>Max Tokens: {agent.maxTokens}</div>
                  <div>Temperature: {agent.temperature}</div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStatus(agent.id, agent.status)}
                    className="w-full"
                  >
                    {agent.status === "active" ? "Deactivate" : "Activate"}
                  </Button>

                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Edit className="h-4 w-4" />
                      <span className="sm:hidden ml-2">Edit</span>
                    </Button>

                    <EmbedCodeGenerator agent={agent} />

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                          <Trash2 className="h-4 w-4" />
                          <span className="sm:hidden ml-2">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Agent</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{agent.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(agent.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AgentsPage() {
  return (
    <ProtectedRoute>
      <AgentsContent />
    </ProtectedRoute>
  )
}
