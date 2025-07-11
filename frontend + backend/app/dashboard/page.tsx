"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, MessageSquare, Wallet, Crown, Plus, TrendingUp, Copy, Network } from "lucide-react"
import { useAppStore } from "@/lib/store"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { useBalance, useAccount } from "wagmi"
import { liskSepolia } from "@/components/providers"
import { useState } from "react"

function DashboardContent() {
  const { agents, user } = useAppStore()
  const { address, chainId } = useAccount()
  const [copied, setCopied] = useState(false)
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address,
    chainId: liskSepolia.id,
  })

  const activeAgents = agents.filter((agent) => agent.status === "active").length
  const totalChats = agents.reduce((sum, agent) => sum + agent.chatCount, 0)

  // Format balance dengan 4 desimal
  const formatBalance = (balance: any) => {
    if (!balance || balanceLoading) return "Loading..."
    return `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
  }

  // Copy address ke clipboard
  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Format address untuk display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Get network name berdasarkan chainId
  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case liskSepolia.id:
        return "Lisk Sepolia"
      default:
        return `Chain ${chainId}`
    }
  }

  const stats = [
    {
      title: "Active Agents",
      value: activeAgents,
      description: `${agents.length} total agents`,
      icon: Bot,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Total Chats",
      value: totalChats.toLocaleString(),
      description: "Across all agents",
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Wallet Balance",
      value: formatBalance(balance),
      description: "Available balance",
      icon: Wallet,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Subscription",
      value: user?.subscription?.toUpperCase() || "FREE",
      description: user?.subscription === "premium" ? "Premium features" : "Basic features",
      icon: Crown,
      color: user?.subscription === "premium" ? "text-yellow-600" : "text-gray-600",
      bgColor: user?.subscription === "premium" ? "bg-yellow-50 dark:bg-yellow-900/20" : "bg-gray-50 dark:bg-gray-800",
    },
  ]

  const recentAgents = agents.slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Overview of your AI agents and activity</p>
          {address && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Wallet:</span>
                <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {formatAddress(address)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                {copied && (
                  <span className="text-xs text-green-600 dark:text-green-400">Copied!</span>
                )}
              </div>
              {chainId && (
                <div className="flex items-center gap-2">
                  <Network className="h-3 w-3 text-gray-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {getNetworkName(chainId)} (ID: {chainId})
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        <Link href="/create-agent">
          <Button className="flex items-center gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Create Agent
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Agents */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Recent Agents
            </CardTitle>
            <CardDescription>Your most recently created AI agents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAgents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{agent.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{agent.chatCount} chats</p>
                </div>
                <Badge variant={agent.status === "active" ? "default" : "secondary"}>{agent.status}</Badge>
              </div>
            ))}
            {recentAgents.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No agents created yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/create-agent">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Create New Agent
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <MessageSquare className="h-4 w-4 mr-2" />
                Test Agent Chat
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </Link>
            <Link href="/billing">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
