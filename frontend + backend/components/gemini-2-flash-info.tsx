import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Zap, Eye, Code } from "lucide-react"

export function Gemini2FlashInfo() {
  return (
    <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Gemini 2.0 Flash
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            Latest
          </Badge>
        </CardTitle>
        <CardDescription className="text-purple-700 dark:text-purple-300">
          Google's newest multimodal AI model with enhanced capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <Zap className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Enhanced Performance</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Faster response times and improved reasoning</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Eye className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Multimodal</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Text, image, and vision capabilities</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Code className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Better Coding</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Improved code generation and debugging</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Advanced Reasoning</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Better understanding of complex queries</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
          <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Why choose Gemini 2.0 Flash?</p>
          <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
            Perfect for agents that need fast, intelligent responses with multimodal understanding. 
            Great for customer support, technical assistance, and creative tasks.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
