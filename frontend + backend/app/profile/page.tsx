"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Wallet, Edit, Save, Copy, ExternalLink } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { ProtectedRoute } from "@/components/protected-route"
import { useToast } from "@/hooks/use-toast"
import { useAccount, useBalance } from "wagmi"

function ProfileContent() {
  const { address, isConnected } = useAccount()
  const { data: balanceData } = useBalance({ address })
  const { user, setUser } = useAppStore()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
  })

  // Use wallet data if connected, fallback to store data
  const currentUser = isConnected ? {
    address: address || "",
    displayName: user?.displayName || "",
    email: user?.email || "",
    subscription: user?.subscription || "free",
    balance: balanceData ? parseFloat(balanceData.formatted) : 0,
    avatar: user?.avatar || ""
  } : user

  const handleSave = () => {
    if (currentUser) {
      setUser({
        ...currentUser,
        displayName: formData.displayName,
        email: formData.email,
      })
      setIsEditing(false)
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      })
    }
  }

  const handleCancel = () => {
    setFormData({
      displayName: currentUser?.displayName || "",
      email: currentUser?.email || "",
    })
    setIsEditing(false)
  }

  const copyAddress = () => {
    if (currentUser?.address) {
      navigator.clipboard.writeText(currentUser.address)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
      })
    }
  }

  const openInExplorer = () => {
    if (currentUser?.address) {
      // Mock blockchain explorer URL
      window.open(`https://explorer.lisk.com/address/${currentUser.address}`, "_blank")
    }
  }

  if (!currentUser) return null

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4 sm:px-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your account information and preferences</p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Your personal information and display preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">
                {currentUser.displayName?.charAt(0) || currentUser.address.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {currentUser.displayName || "Unnamed User"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">Member since January 2024</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <Badge variant={currentUser.subscription === "premium" ? "default" : "secondary"}>
                  {currentUser.subscription.toUpperCase()}
                </Badge>
                <Badge variant="outline">Verified</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              {isEditing ? (
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
                  placeholder="Enter your display name"
                />
              ) : (
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">{currentUser.displayName || "Not set"}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              ) : (
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">{currentUser.email || "Not set"}</div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Wallet Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Information
          </CardTitle>
          <CardDescription>Your connected blockchain wallet details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Wallet Address</Label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-1">
                <code className="flex-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-md text-sm font-mono break-all">
                  {currentUser.address}
                </code>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyAddress}
                    className="flex-1 sm:flex-none bg-transparent"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sm:hidden ml-2">Copy</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openInExplorer}
                    className="flex-1 sm:flex-none bg-transparent"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="sm:hidden ml-2">Explorer</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Balance</Label>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md mt-1">
                  <span className="font-mono">{currentUser.balance} {balanceData?.symbol || "LSK"}</span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Network</Label>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md mt-1">
                  <span>Lisk Sepolia</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Wallet Security</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Your wallet is secured by your private keys</li>
              <li>• Never share your private keys or seed phrase</li>
              <li>• Always verify transaction details before signing</li>
              <li>• Keep your wallet software updated</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
          <CardDescription>Overview of your account activity and usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">3</div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Agents Created</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">245</div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Chats</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">15</div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Days Active</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {currentUser.subscription === "premium" ? "$29" : "$0"}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Monthly Spend</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}
