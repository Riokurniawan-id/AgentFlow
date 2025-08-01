"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bot,
  Save,
  ArrowLeft,
  Upload,
  FileText,
  Brain,
  Smile,
  Briefcase,
  Code,
  Palette,
  GraduationCap,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { useToast } from "@/hooks/use-toast"
import { useWriteContract } from "wagmi"
import { AGENT_REGISTRY_ADDRESS, AGENT_REGISTRY_ABI } from "@/lib/agent-contract"
import { stringToBytes, keccak256 } from "viem"
import { APIKeyHelp } from "@/components/api-key-help"
import { Gemini2FlashInfo } from "@/components/gemini-2-flash-info"

function CreateAgentContent() {
  const { addAgent } = useAppStore()
  const router = useRouter()
  const { toast } = useToast()
  const { writeContractAsync } = useWriteContract()

  const [formData, setFormData] = useState({
    name: "",
    personalityType: "friendly" as "custom" | "friendly" | "professional" | "technical" | "creative" | "formal",
    personality: "",
    knowledgeBase: {
      type: "manual" as "manual" | "document" | "url",
      content: "",
      fileName: "",
      url: "",
    },
    apiKey: "",
    aiProvider: "gemini" as "openai" | "gemini",
    aiModel: "gemini-2.0-flash",
    maxTokens: 1000,
    temperature: 0.7,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isTestingApiKey, setIsTestingApiKey] = useState(false)
  const [apiKeyStatus, setApiKeyStatus] = useState<'idle' | 'valid' | 'invalid'>('idle')

  const personalityOptions = [
    {
      value: "friendly",
      label: "Friendly & Helpful",
      description: "Warm, approachable, and eager to help users",
      icon: Smile,
      example: "Hi there! I'm excited to help you today. What can I assist you with?",
    },
    {
      value: "professional",
      label: "Professional & Business",
      description: "Formal, efficient, and business-focused",
      icon: Briefcase,
      example: "Good day. I'm here to provide professional assistance. How may I help you?",
    },
    {
      value: "technical",
      label: "Technical Expert",
      description: "Knowledgeable, precise, and detail-oriented",
      icon: Code,
      example: "I'm a technical specialist ready to help with complex problems. What's your question?",
    },
    {
      value: "creative",
      label: "Creative & Innovative",
      description: "Imaginative, inspiring, and out-of-the-box thinking",
      icon: Palette,
      example: "Let's explore creative solutions together! What inspiring project are we working on?",
    },
    {
      value: "formal",
      label: "Formal & Academic",
      description: "Scholarly, structured, and academically rigorous",
      icon: GraduationCap,
      example: "I shall provide comprehensive assistance with academic precision. How may I be of service?",
    },
    {
      value: "custom",
      label: "Custom Personality",
      description: "Define your own unique personality",
      icon: Bot,
      example: "Create your own unique personality description...",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an agent name.",
        variant: "destructive",
      })
      return
    }

    if (formData.personalityType === "custom" && !formData.personality.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a custom personality description.",
        variant: "destructive",
      })
      return
    }

    if (!formData.knowledgeBase.content.trim() && !formData.knowledgeBase.url.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide knowledge base content.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Hash detail agent (off-chain data)
      const agentDetail = JSON.stringify(formData)
      const hash = keccak256(stringToBytes(agentDetail))
      const selectedPersonality = personalityOptions.find((p) => p.value === formData.personalityType)
      // Kirim transaksi ke smart contract
      await writeContractAsync({
        address: AGENT_REGISTRY_ADDRESS,
        abi: AGENT_REGISTRY_ABI,
        functionName: "createAgent",
        args: [
          formData.name,
          hash,
          formData.personalityType,
        ],
      })
      // Simpan ke store lokal dan Supabase
      const newAgent = await addAgent({
        name: formData.name,
        personality:
          formData.personalityType === "custom" ? formData.personality : selectedPersonality?.description || "",
        personalityType: formData.personalityType,
        knowledgeBase: formData.knowledgeBase,
        apiKey: formData.apiKey || undefined,
        aiProvider: formData.aiProvider,
        aiModel: formData.aiModel || undefined,
        maxTokens: formData.maxTokens,
        temperature: formData.temperature,
        status: "active",
      })

      if (!newAgent) {
        throw new Error("Failed to save agent to database")
      }
      toast({
        title: "Agent Created",
        description: "Your AI agent has been successfully created and deployed to the blockchain.",
      })
      router.push("/agents")
    } catch (err: any) {
      console.error('Error creating agent:', err)
      
      // Check if it's a database error or blockchain error
      const isDatabaseError = err?.message?.includes('database') || 
                             err?.message?.includes('Supabase') ||
                             err?.message?.includes('Failed to save agent')
      
      toast({
        title: isDatabaseError ? "Database Error" : "Blockchain Error",
        description: err?.message || (isDatabaseError ? "Failed to save agent to database" : "Failed to create agent on blockchain."),
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object),
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      handleInputChange("knowledgeBase.fileName", file.name)

      // Simulate file reading
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        handleInputChange("knowledgeBase.content", content.slice(0, 5000)) // Limit content
      }
      reader.readAsText(file)

      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      })
    }
  }

  const testApiKey = async () => {
    if (!formData.apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter an API key to test.",
        variant: "destructive",
      })
      return
    }

    setIsTestingApiKey(true)
    setApiKeyStatus('idle')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: "Hello, this is a test message.",
          personality: "You are a test assistant.",
          apiKey: formData.apiKey,
          aiProvider: formData.aiProvider,
          aiModel: formData.aiModel,
          maxTokens: 50,
          temperature: 0.1,
        }),
      })

      const data = await response.json()

      if (response.ok && data.response) {
        setApiKeyStatus('valid')
        toast({
          title: "API Key Valid",
          description: "Your API key is working correctly!",
        })
      } else {
        throw new Error(data.error || 'Invalid response')
      }
    } catch (error: any) {
      setApiKeyStatus('invalid')
      toast({
        title: "API Key Invalid",
        description: error.message || "The API key is not working. Please check and try again.",
        variant: "destructive",
      })
    } finally {
      setIsTestingApiKey(false)
    }
  }

  const selectedPersonality = personalityOptions.find((p) => p.value === formData.personalityType)

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto bg-transparent"
          onClick={() => router.push("/agents")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Agents
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Create New Agent</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Configure your AI agent's personality, knowledge, and behavior
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Set up your AI agent's basic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Agent Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Customer Support Bot"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            {/* AI Configuration Section */}
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Configuration
                </CardTitle>
                <CardDescription>
                  Configure the AI provider and settings for your agent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aiProvider">AI Provider</Label>
                    <Select 
                      value={formData.aiProvider} 
                      onValueChange={(value) => handleInputChange("aiProvider", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select AI provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI (GPT)</SelectItem>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aiModel">AI Model (Optional)</Label>
                    <Select 
                      value={formData.aiModel} 
                      onValueChange={(value) => handleInputChange("aiModel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select model (default will be used if empty)" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.aiProvider === "openai" ? (
                          <>
                            <SelectItem value="gpt-4">GPT-4</SelectItem>
                            <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                            <SelectItem value="gpt-3.5-turbo-16k">GPT-3.5 Turbo 16K</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash (Latest)</SelectItem>
                            <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                            <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="apiKey">API Key (Optional)</Label>
                    {formData.apiKey && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={testApiKey}
                        disabled={isTestingApiKey}
                        className={`text-xs ${
                          apiKeyStatus === 'valid' 
                            ? 'border-green-500 text-green-600' 
                            : apiKeyStatus === 'invalid' 
                            ? 'border-red-500 text-red-600' 
                            : ''
                        }`}
                      >
                        {isTestingApiKey ? (
                          <>
                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                            Testing...
                          </>
                        ) : apiKeyStatus === 'valid' ? (
                          <>
                            ✓ Valid
                          </>
                        ) : apiKeyStatus === 'invalid' ? (
                          <>
                            ✗ Invalid
                          </>
                        ) : (
                          'Test API Key'
                        )}
                      </Button>
                    )}
                  </div>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder={`Your ${formData.aiProvider === 'openai' ? 'OpenAI' : 'Google Gemini'} API key`}
                    value={formData.apiKey}
                    onChange={(e) => {
                      handleInputChange("apiKey", e.target.value)
                      setApiKeyStatus('idle') // Reset status when key changes
                    }}
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Leave empty to use fallback responses. With an API key, your agent will provide intelligent AI-powered responses.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* API Key Help */}
            <APIKeyHelp provider={formData.aiProvider} />

            {/* Gemini 2.0 Flash Info */}
            {formData.aiProvider === 'gemini' && (
              <Gemini2FlashInfo />
            )}
          </CardContent>
        </Card>

        {/* Personality Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Personality & Behavior
            </CardTitle>
            <CardDescription>Choose how your AI agent should interact with users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personalityOptions.map((option) => (
                <div
                  key={option.value}
                  className={`relative p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    formData.personalityType === option.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  onClick={() => handleInputChange("personalityType", option.value)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        formData.personalityType === option.value
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      <option.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{option.label}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{option.description}</p>
                    </div>
                  </div>
                  {formData.personalityType === option.value && (
                    <Badge className="absolute top-2 right-2" variant="default">
                      Selected
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {selectedPersonality && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Preview Response:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{selectedPersonality.example}"</p>
              </div>
            )}

            {formData.personalityType === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="personality">Custom Personality Description *</Label>
                <Textarea
                  id="personality"
                  placeholder="Describe your agent's personality, role, and behavior. Be specific about how it should interact with users."
                  value={formData.personality}
                  onChange={(e) => handleInputChange("personality", e.target.value)}
                  rows={4}
                  required
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Knowledge Base */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Knowledge Base
            </CardTitle>
            <CardDescription>Provide information that your AI agent should know about</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={formData.knowledgeBase.type}
              onValueChange={(value) => handleInputChange("knowledgeBase.type", value)}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Manual Input
                </TabsTrigger>
                <TabsTrigger value="document" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Document
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  From URL
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="manualContent">Knowledge Content *</Label>
                  <Textarea
                    id="manualContent"
                    placeholder="Enter the information your AI agent should know. This could include company information, product details, FAQs, policies, or any specific knowledge relevant to your use case."
                    value={formData.knowledgeBase.content}
                    onChange={(e) => handleInputChange("knowledgeBase.content", e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tip: Be specific and organized. Use clear sections and bullet points for better AI understanding.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="document" className="space-y-4">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upload Document</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Upload a text file, PDF, or document containing your knowledge base
                      </p>
                      <div className="flex items-center justify-center">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Button type="button" variant="outline" className="bg-transparent">
                            <Upload className="h-4 w-4 mr-2" />
                            Choose File
                          </Button>
                          <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept=".txt,.pdf,.doc,.docx,.md"
                            onChange={handleFileUpload}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {uploadedFile && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-200">{uploadedFile.name}</p>
                          <p className="text-sm text-green-600 dark:text-green-300">
                            File uploaded successfully • {(uploadedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="documentPreview">Document Content Preview</Label>
                    <Textarea
                      id="documentPreview"
                      value={formData.knowledgeBase.content}
                      onChange={(e) => handleInputChange("knowledgeBase.content", e.target.value)}
                      rows={6}
                      placeholder="Document content will appear here after upload..."
                      className="resize-none"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="knowledgeUrl">Website URL *</Label>
                    <Input
                      id="knowledgeUrl"
                      type="url"
                      placeholder="https://example.com/knowledge-base"
                      value={formData.knowledgeBase.url}
                      onChange={(e) => handleInputChange("knowledgeBase.url", e.target.value)}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enter a URL to scrape content from. The AI will extract and learn from the webpage content.
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      if (formData.knowledgeBase.url) {
                        // Simulate URL scraping
                        handleInputChange(
                          "knowledgeBase.content",
                          `Content scraped from: ${formData.knowledgeBase.url}\n\nThis is simulated content that would be extracted from the provided URL. In a real implementation, this would contain the actual webpage content.`,
                        )
                        toast({
                          title: "Content Scraped",
                          description: "Successfully extracted content from the provided URL.",
                        })
                      }
                    }}
                    disabled={!formData.knowledgeBase.url}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Scrape Content from URL
                  </Button>

                  {formData.knowledgeBase.content && (
                    <div className="space-y-2">
                      <Label htmlFor="urlContent">Scraped Content Preview</Label>
                      <Textarea
                        id="urlContent"
                        value={formData.knowledgeBase.content}
                        onChange={(e) => handleInputChange("knowledgeBase.content", e.target.value)}
                        rows={6}
                        className="resize-none"
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription>Fine-tune your agent's response behavior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Max Tokens: {formData.maxTokens}</Label>
                <Slider
                  value={[formData.maxTokens]}
                  onValueChange={(value) => handleInputChange("maxTokens", value[0])}
                  max={4000}
                  min={100}
                  step={100}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">Maximum length of the agent's responses</p>
              </div>

              <div className="space-y-3">
                <Label>Temperature: {formData.temperature}</Label>
                <Slider
                  value={[formData.temperature]}
                  onValueChange={(value) => handleInputChange("temperature", value[0])}
                  max={2}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Controls creativity (0 = focused, 2 = creative)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? (
              <>Creating Agent...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Agent
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto bg-transparent"
            onClick={() => router.push("/agents")}
          >
            Cancel
          </Button>
        </div>
      </form>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>What happens next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <p>• Your agent configuration will be stored on the Lisk blockchain</p>
          <p>• The knowledge base will be processed and indexed for optimal performance</p>
          <p>• The agent will be immediately available for testing and deployment</p>
          <p>• You can modify settings later from the My Agents page</p>
          <p>• Premium users get access to advanced AI models and larger knowledge bases</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CreateAgentPage() {
  return (
    <ProtectedRoute>
      <CreateAgentContent />
    </ProtectedRoute>
  )
}
