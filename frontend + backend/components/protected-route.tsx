"use client"

import type React from "react"
import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import { WalletConnect } from "@/components/wallet-connect"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"

function ProtectedRouteContent({ children }: { children: React.ReactNode }) {
  const { isConnected, isConnecting } = useAccount();

  // If still connecting, show loading
  if (isConnecting) {
    return null; // Atau loading spinner
  }

  if (!isConnected) {
    return <WalletConnect />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [wagmiReady, setWagmiReady] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Give time for WagmiProvider to initialize
    const timer = setTimeout(() => {
      setWagmiReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || !wagmiReady) {
    return null; // Atau loading spinner
  }

  return <ProtectedRouteContent>{children}</ProtectedRouteContent>;
}
