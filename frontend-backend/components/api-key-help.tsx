import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Key, AlertCircle } from "lucide-react"

interface APIKeyHelpProps {
  provider: 'openai' | 'gemini'
}

export function APIKeyHelp({ provider }: APIKeyHelpProps) {
  const getProviderInfo = () => {
    if (provider === 'openai') {
      return {
        name: 'OpenAI',
        url: 'https://platform.openai.com/api-keys',
        steps: [
          'Go to OpenAI Platform (platform.openai.com)',
          'Sign in or create an account',
          'Navigate to API Keys section',
          'Click "Create new secret key"',
          'Copy your API key and paste it here'
        ],
        pricing: 'Pay-per-use. GPT-3.5-turbo costs ~$0.002/1K tokens'
      }
    } else {
      return {
        name: 'Google Gemini',
        url: 'https://makersuite.google.com/app/apikey',
        steps: [
          'Go to Google AI Studio (makersuite.google.com)',
          'Sign in with your Google account',
          'Click "Get API key"',
          'Create a new API key',
          'Copy your API key and paste it here'
        ],
        pricing: 'Free tier available with rate limits. Gemini 2.0 Flash offers improved performance and multimodal capabilities.'
      }
    }
  }

  const info = getProviderInfo()

  return (
    <Card className="border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Key className="h-4 w-4" />
          How to get your {info.name} API Key
        </CardTitle>
        <CardDescription>
          Follow these steps to obtain your API key
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Steps:</h4>
          <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            {info.steps.map((step, index) => (
              <li key={index} className="flex">
                <span className="font-medium mr-2">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-yellow-800 dark:text-yellow-200">Pricing Info:</p>
            <p className="text-yellow-700 dark:text-yellow-300">{info.pricing}</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => window.open(info.url, '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open {info.name} Platform
        </Button>
      </CardContent>
    </Card>
  )
}
