"use client"

import { useState } from "react"
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
import { Crown, CreditCard, Check, Zap, Shield, Calendar } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { ProtectedRoute } from "@/components/protected-route"
import { useToast } from "@/hooks/use-toast"

function BillingContent() {
  const { user, setUser } = useAppStore()
  const { toast } = useToast()
  const [isUpgrading, setIsUpgrading] = useState(false)

  const handleUpgrade = async () => {
    setIsUpgrading(true)

    // Simulate blockchain payment
    setTimeout(() => {
      if (user) {
        setUser({
          ...user,
          subscription: "premium",
        })
        toast({
          title: "Upgrade Successful!",
          description: "Welcome to Premium! Your new features are now active.",
        })
      }
      setIsUpgrading(false)
    }, 3000)
  }

  const handleDowngrade = () => {
    if (user) {
      setUser({
        ...user,
        subscription: "free",
      })
      toast({
        title: "Downgraded to Free",
        description: "You've been downgraded to the free plan.",
      })
    }
  }

  const freeFeatures = [
    "Up to 3 AI agents",
    "100 chats per month",
    "Basic analytics",
    "Community support",
    "Standard AI models",
  ]

  const premiumFeatures = [
    "Unlimited AI agents",
    "Unlimited chats",
    "Advanced analytics & insights",
    "Priority support",
    "Premium AI models (GPT-4, Claude)",
    "Custom API integrations",
    "White-label options",
    "Advanced security features",
  ]

  const transactionHistory = [
    {
      id: "1",
      date: "2024-01-15",
      description: "Premium Subscription",
      amount: "$29.00",
      status: "completed",
      txHash: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4C053292...",
    },
    {
      id: "2",
      date: "2024-01-01",
      description: "Account Setup",
      amount: "$0.00",
      status: "completed",
      txHash: "0x8f3e21Bb7845D1623847a2c9E5F184729...",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Billing & Subscription</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your subscription and payment methods</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Current Plan
          </CardTitle>
          <CardDescription>Your current subscription status and usage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user?.subscription === "premium" ? "Premium Plan" : "Free Plan"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {user?.subscription === "premium" ? "All premium features included" : "Basic features with limitations"}
              </p>
            </div>
            <Badge variant={user?.subscription === "premium" ? "default" : "secondary"} className="text-lg px-4 py-2">
              {user?.subscription?.toUpperCase()}
            </Badge>
          </div>

          {user?.subscription === "premium" && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <Check className="h-4 w-4" />
                <span className="font-medium">Premium Active</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                Next billing date: February 15, 2024 • $29.00/month
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={user?.subscription === "free" ? "ring-2 ring-blue-500" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Free Plan
            </CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              $0<span className="text-lg font-normal text-gray-500">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {freeFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  {feature}
                </li>
              ))}
            </ul>
            {user?.subscription === "premium" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full bg-transparent">
                    Downgrade to Free
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Downgrade to Free Plan?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You'll lose access to premium features and your agents may be limited. This action will take
                      effect at the end of your current billing period.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDowngrade}>Confirm Downgrade</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardContent>
        </Card>

        <Card className={user?.subscription === "premium" ? "ring-2 ring-yellow-500" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              Premium Plan
            </CardTitle>
            <CardDescription>For power users and businesses</CardDescription>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              $29<span className="text-lg font-normal text-gray-500">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  {feature}
                </li>
              ))}
            </ul>
            {user?.subscription !== "premium" && (
              <Button onClick={handleUpgrade} disabled={isUpgrading} className="w-full">
                {isUpgrading ? "Processing..." : "Upgrade to Premium"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
          <CardDescription>Your blockchain wallet is used for all payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Lisk Wallet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.address.slice(0, 6)}...{user?.address.slice(-4)}
                </p>
              </div>
            </div>
            <Badge variant="outline">Connected</Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Payments are processed securely through the Lisk blockchain. Make sure you have sufficient LSK tokens for
            subscription payments.
          </p>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <CardDescription>Your recent payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {transactionHistory.length > 0 ? (
            <div className="space-y-4">
              {transactionHistory.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg gap-2 sm:gap-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()} •
                      <span className="font-mono ml-1 break-all">{transaction.txHash.slice(0, 10)}...</span>
                    </p>
                  </div>
                  <div className="flex sm:flex-col items-start sm:items-end gap-2 sm:gap-1">
                    <p className="font-medium text-gray-900 dark:text-white">{transaction.amount}</p>
                    <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm">Your payment history will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function BillingPage() {
  return (
    <ProtectedRoute>
      <BillingContent />
    </ProtectedRoute>
  )
}
