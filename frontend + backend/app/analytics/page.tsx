"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import { TrendingUp, MessageSquare, Bot, Calendar } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { ProtectedRoute } from "@/components/protected-route"

function AnalyticsContent() {
  const { agents, user } = useAppStore()

  // Mock data for charts
  const chatData = [
    { date: "2024-01-01", chats: 12 },
    { date: "2024-01-02", chats: 19 },
    { date: "2024-01-03", chats: 8 },
    { date: "2024-01-04", chats: 25 },
    { date: "2024-01-05", chats: 18 },
    { date: "2024-01-06", chats: 32 },
    { date: "2024-01-07", chats: 28 },
  ]

  const agentActivityData = agents.map((agent) => ({
    name: agent.name,
    chats: agent.chatCount,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
  }))

  const monthlyRevenueData = [
    { month: "Jan", revenue: 0 },
    { month: "Feb", revenue: 0 },
    { month: "Mar", revenue: user?.subscription === "premium" ? 29 : 0 },
    { month: "Apr", revenue: user?.subscription === "premium" ? 29 : 0 },
    { month: "May", revenue: user?.subscription === "premium" ? 29 : 0 },
  ]

  const totalChats = agents.reduce((sum, agent) => sum + agent.chatCount, 0)
  const activeAgents = agents.filter((agent) => agent.status === "active").length
  const avgChatsPerAgent = agents.length > 0 ? Math.round(totalChats / agents.length) : 0

  const stats = [
    {
      title: "Total Conversations",
      value: totalChats.toLocaleString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: MessageSquare,
    },
    {
      title: "Active Agents",
      value: activeAgents.toString(),
      change: `${agents.length} total`,
      changeType: "neutral" as const,
      icon: Bot,
    },
    {
      title: "Avg. Chats/Agent",
      value: avgChatsPerAgent.toString(),
      change: "+8%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      title: "This Month",
      value: "89 chats",
      change: "+23%",
      changeType: "positive" as const,
      icon: Calendar,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-300">Track your AI agents' performance and usage statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs">
                <Badge variant={stat.changeType === "positive" ? "default" : "secondary"} className="text-xs">
                  {stat.change}
                </Badge>
                <span className="text-gray-500 dark:text-gray-400">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Chat Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Chat Activity</CardTitle>
            <CardDescription>Number of conversations per day over the last week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chatData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value) => [value, "Chats"]}
                />
                <Line type="monotone" dataKey="chats" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Agent Activity Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Activity Distribution</CardTitle>
            <CardDescription>Chat distribution across your AI agents</CardDescription>
          </CardHeader>
          <CardContent>
            {agentActivityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={agentActivityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="chats"
                  >
                    {agentActivityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Chats"]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No agent data available</p>
                  <p className="text-sm">Create some agents to see analytics</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Chart (Premium Feature) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Monthly Revenue
              {user?.subscription !== "premium" && <Badge variant="outline">Premium</Badge>}
            </CardTitle>
            <CardDescription>
              {user?.subscription === "premium"
                ? "Your subscription revenue over time"
                : "Upgrade to premium to track revenue"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Bar dataKey="revenue" fill={user?.subscription === "premium" ? "#10b981" : "#d1d5db"} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators for your agents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average Response Time</span>
                <span className="font-medium">1.2s</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>User Satisfaction</span>
                <span className="font-medium">4.8/5</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "96%" }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uptime</span>
                <span className="font-medium">99.9%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "99%" }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API Usage</span>
                <span className="font-medium">67%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "67%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Performance Details</CardTitle>
          <CardDescription>Detailed statistics for each of your AI agents</CardDescription>
        </CardHeader>
        <CardContent>
          {agents.length > 0 ? (
            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 whitespace-nowrap">Agent Name</th>
                      <th className="text-left py-3 px-4 whitespace-nowrap">Status</th>
                      <th className="text-left py-3 px-4 whitespace-nowrap">Total Chats</th>
                      <th className="text-left py-3 px-4 whitespace-nowrap hidden sm:table-cell">Avg. Response Time</th>
                      <th className="text-left py-3 px-4 whitespace-nowrap hidden md:table-cell">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((agent) => (
                      <tr key={agent.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            <span className="truncate">{agent.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <Badge variant={agent.status === "active" ? "default" : "secondary"}>{agent.status}</Badge>
                        </td>
                        <td className="py-3 px-4 font-medium whitespace-nowrap">{agent.chatCount}</td>
                        <td className="py-3 px-4 whitespace-nowrap hidden sm:table-cell">
                          1.{Math.floor(Math.random() * 9)}s
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap hidden md:table-cell">
                          {new Date(agent.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No agents to analyze</p>
              <p className="text-sm">Create some agents to see detailed analytics</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsContent />
    </ProtectedRoute>
  )
}
