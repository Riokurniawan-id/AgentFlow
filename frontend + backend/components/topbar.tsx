"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { Wallet } from "lucide-react"

export function Topbar() {
  const { user } = useAppStore()

  if (!user) return null

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center space-x-4">
        {/* Mobile menu trigger will be here */}
        <div className="md:hidden">{/* This will be handled by the Sidebar component */}</div>
        <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate">
          Welcome back, {user.displayName || "Agent Creator"}
        </h2>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <Wallet className="h-4 w-4" />
          <span>{user.balance} LSK</span>
        </div>

        <Badge variant={user.subscription === "premium" ? "default" : "secondary"} className="text-xs">
          {user.subscription.toUpperCase()}
        </Badge>

        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar || "/placeholder.svg"} />
          <AvatarFallback className="text-xs">
            {user.displayName?.charAt(0) || user.address.slice(2, 4).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
