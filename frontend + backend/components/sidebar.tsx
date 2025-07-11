"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, Bot, Plus, MessageSquare, BarChart3, CreditCard, User, LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Agents",
    href: "/agents",
    icon: Bot,
  },
  {
    name: "Create Agent",
    href: "/create-agent",
    icon: Plus,
  },
  {
    name: "Chat Test",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { setUser, setConnected } = useAppStore()

  const handleLogout = () => {
    setUser(null)
    setConnected(false)
    router.push("/")
  }

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center px-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">AgentFlow</h1>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Disconnect
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-64 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col bg-white dark:bg-gray-900">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
