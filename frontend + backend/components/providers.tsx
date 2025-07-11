"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

// Tambahan Web3
import "@rainbow-me/rainbowkit/styles.css"
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { WagmiProvider, http } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { sepolia } from "wagmi/chains"
import { Chain } from "wagmi/chains";
import { useEffect, useState } from "react"

export const liskSepolia: Chain = {
  id: 4202, // Ganti dengan chainId Lisk Sepolia yang benar
  name: "Lisk Sepolia",
  nativeCurrency: {
    name: "Lisk",
    symbol: "LSK",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://rpc.sepolia-api.lisk.com"] }, // Ganti dengan RPC Lisk Sepolia yang benar
    public: { http: ["https://rpc.sepolia-api.lisk.com"] },
  },
  blockExplorers: {
    default: { name: "Lisk Explorer", url: "https://sepolia-explorer.lisk.com" }, // Ganti jika ada
  },
  testnet: true,
};

const config = getDefaultConfig({
  appName: "AgentFlow",
  projectId: "7ffecfce137da991656e7dd123f41ca5", // ⚠️ GANTI DENGAN PROJECT ID ASLI DARI https://cloud.walletconnect.com/
  chains: [liskSepolia], // Ganti sepolia dengan liskSepolia
  transports: {
    [liskSepolia.id]: http(),
  },
});

const queryClient = new QueryClient()

function Web3Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Tampilkan loading sampai mounted
  if (!mounted) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <Web3Providers>{children}</Web3Providers>
}
