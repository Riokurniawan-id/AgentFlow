"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Shield, Zap } from "lucide-react"

export function WalletConnect() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AgentFlow
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
            Create, manage, and deploy AI agents on the blockchain
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <Card>
            <CardHeader className="text-center">
              <Zap className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle>Create AI Agents</CardTitle>
              <CardDescription>Build custom AI agents with unique personalities and capabilities</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Blockchain Secured</CardTitle>
              <CardDescription>Your agents are secured and managed on the Lisk blockchain</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Wallet className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <CardTitle>Wallet Integration</CardTitle>
              <CardDescription>Connect your crypto wallet to get started with agent management</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Wallet className="h-6 w-6" />
              Connect Your Wallet
            </CardTitle>
            <CardDescription>Connect your MetaMask or other Web3 wallet to access the portal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ConnectButton chainStatus="icon" showBalance={false} accountStatus="address" />
            <p className="text-sm text-gray-500 text-center px-2">
              Make sure you have MetaMask installed dan sudah di jaringan yang sesuai
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
