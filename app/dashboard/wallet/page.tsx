"use client"

import { useAuth } from "@/hooks/useAuth"
import NGOWallet from "@/components/wallet/NGOWallet"

export default function WalletPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Please log in to access your wallet</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background wallet-container">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Wallet Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your carbon credit transactions and wallet balance
          </p>
        </div>
        
        <NGOWallet />
      </div>
    </div>
  )
}
