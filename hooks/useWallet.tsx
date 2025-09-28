"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { toast } from "@/hooks/use-toast"

// Types
export interface Transaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  status: 'completed' | 'pending' | 'failed'
  date: string
  category: 'carbon_credits' | 'funding' | 'expense' | 'reward' | 'transfer'
  hash?: string
  toAddress?: string
  fromAddress?: string
}

export interface WalletData {
  balance: number
  currency: string
  address: string
  totalEarned: number
  opportunitiesListed: number
  carbonCredits: number
  monthlyIncome: number
  monthlyExpense: number
  transactions: Transaction[]
}

export interface WalletContextType {
  walletData: WalletData
  isLoading: boolean
  sendTransaction: (toAddress: string, amount: number, description: string) => Promise<boolean>
  receiveTransaction: (amount: number, description: string) => Promise<boolean>
  addFunds: (amount: number, method: string) => Promise<boolean>
  withdrawFunds: (amount: number, toAddress: string) => Promise<boolean>
  generateQRCode: (data: string) => string
  refreshBalance: () => Promise<void>
  updateTransactionStatus: (transactionId: string, status: Transaction['status']) => void
  validateAddress: (address: string) => boolean
  getTransactionHistory: (page?: number, limit?: number) => Transaction[]
  getWalletStats: () => {
    totalTransactions: number
    completedTransactions: number
    pendingTransactions: number
    failedTransactions: number
    totalReceived: number
    totalSent: number
    successRate: number
  }
}

// Mock blockchain simulation
const simulateBlockchainDelay = () => new Promise(resolve => setTimeout(resolve, 2000))

const generateTransactionHash = () => `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`

const generateWalletAddress = () => `0x${Math.random().toString(16).substr(2, 40)}`

// Initial wallet data
const initialWalletData: WalletData = {
  balance: 125000,
  currency: "INR",
  address: generateWalletAddress(),
  totalEarned: 896030,
  opportunitiesListed: 24,
  carbonCredits: 245,
  monthlyIncome: 45000,
  monthlyExpense: 12000,
  transactions: [
    {
      id: "1",
      type: "credit",
      amount: 15000,
      description: "Carbon Credits Sale - Sundarbans Project",
      status: "completed",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      category: "carbon_credits",
      hash: generateTransactionHash()
    },
    {
      id: "2", 
      type: "credit",
      amount: 25000,
      description: "Government Funding - Coastal Restoration",
      status: "completed",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      category: "funding",
      hash: generateTransactionHash()
    },
    {
      id: "3",
      type: "debit",
      amount: 5000,
      description: "Equipment Purchase - Mangrove Saplings",
      status: "pending",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      category: "expense",
      hash: generateTransactionHash()
    }
  ]
}

// Context
const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [walletData, setWalletData] = useState<WalletData>(initialWalletData)
  const [isLoading, setIsLoading] = useState(false)

  // Generate QR Code (simplified - in real app, use a QR library)
  const generateQRCode = useCallback((data: string) => {
    // In a real implementation, you would use a QR code library like 'qrcode'
    // For now, we'll return a placeholder
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <text x="100" y="100" text-anchor="middle" font-family="monospace" font-size="12">
          ${data.substring(0, 20)}...
        </text>
      </svg>
    `)}`
  }, [])

  // Validate wallet address
  const validateAddress = useCallback((address: string): boolean => {
    // Basic validation for wallet addresses
    return Boolean(address && address.length >= 10 && address.startsWith('0x'))
  }, [])

  // Get transaction history with pagination
  const getTransactionHistory = useCallback((page: number = 1, limit: number = 10) => {
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    return walletData.transactions.slice(startIndex, endIndex)
  }, [walletData.transactions])

  // Calculate wallet statistics
  const getWalletStats = useCallback(() => {
    const totalTransactions = walletData.transactions.length
    const completedTransactions = walletData.transactions.filter(t => t.status === 'completed').length
    const pendingTransactions = walletData.transactions.filter(t => t.status === 'pending').length
    const failedTransactions = walletData.transactions.filter(t => t.status === 'failed').length
    
    const totalReceived = walletData.transactions
      .filter(t => t.type === 'credit' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalSent = walletData.transactions
      .filter(t => t.type === 'debit' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      totalTransactions,
      completedTransactions,
      pendingTransactions,
      failedTransactions,
      totalReceived,
      totalSent,
      successRate: totalTransactions > 0 ? (completedTransactions / totalTransactions) * 100 : 0
    }
  }, [walletData.transactions])

  // Send Transaction
  const sendTransaction = useCallback(async (toAddress: string, amount: number, description: string): Promise<boolean> => {
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Amount must be greater than 0",
        variant: "destructive"
      })
      return false
    }

    if (!validateAddress(toAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid wallet address",
        variant: "destructive"
      })
      return false
    }

    if (amount > walletData.balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough funds for this transaction",
        variant: "destructive"
      })
      return false
    }

    setIsLoading(true)

    try {
      await simulateBlockchainDelay()

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "debit",
        amount,
        description,
        status: "completed",
        date: new Date().toISOString(),
        category: "transfer",
        hash: generateTransactionHash(),
        toAddress,
        fromAddress: walletData.address
      }

      setWalletData(prev => ({
        ...prev,
        balance: prev.balance - amount,
        transactions: [newTransaction, ...prev.transactions]
      }))

      toast({
        title: "Transaction Sent",
        description: `Successfully sent ₹${amount.toLocaleString()} to ${toAddress.substring(0, 6)}...${toAddress.substring(38)}`,
      })

      return true
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Failed to send transaction. Please try again.",
        variant: "destructive"
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [walletData.balance, walletData.address])

  // Receive Transaction
  const receiveTransaction = useCallback(async (amount: number, description: string): Promise<boolean> => {
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Amount must be greater than 0",
        variant: "destructive"
      })
      return false
    }

    setIsLoading(true)

    try {
      await simulateBlockchainDelay()

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "credit",
        amount,
        description,
        status: "completed",
        date: new Date().toISOString(),
        category: "transfer",
        hash: generateTransactionHash(),
        toAddress: walletData.address
      }

      setWalletData(prev => ({
        ...prev,
        balance: prev.balance + amount,
        totalEarned: prev.totalEarned + amount,
        transactions: [newTransaction, ...prev.transactions]
      }))

      toast({
        title: "Transaction Received",
        description: `Successfully received ₹${amount.toLocaleString()}`,
      })

      return true
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Failed to receive transaction. Please try again.",
        variant: "destructive"
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [walletData.address])

  // Add Funds
  const addFunds = useCallback(async (amount: number, method: string): Promise<boolean> => {
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Amount must be greater than 0",
        variant: "destructive"
      })
      return false
    }

    setIsLoading(true)

    try {
      await simulateBlockchainDelay()

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "credit",
        amount,
        description: `Funds Added via ${method}`,
        status: "completed",
        date: new Date().toISOString(),
        category: "funding",
        hash: generateTransactionHash()
      }

      setWalletData(prev => ({
        ...prev,
        balance: prev.balance + amount,
        totalEarned: prev.totalEarned + amount,
        transactions: [newTransaction, ...prev.transactions]
      }))

      toast({
        title: "Funds Added",
        description: `Successfully added ₹${amount.toLocaleString()} via ${method}`,
      })

      return true
    } catch (error) {
      toast({
        title: "Failed to Add Funds",
        description: "Failed to add funds. Please try again.",
        variant: "destructive"
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Withdraw Funds
  const withdrawFunds = useCallback(async (amount: number, toAddress: string): Promise<boolean> => {
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Amount must be greater than 0",
        variant: "destructive"
      })
      return false
    }

    if (amount > walletData.balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough funds for this withdrawal",
        variant: "destructive"
      })
      return false
    }

    setIsLoading(true)

    try {
      await simulateBlockchainDelay()

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "debit",
        amount,
        description: `Withdrawal to ${toAddress.substring(0, 6)}...${toAddress.substring(38)}`,
        status: "completed",
        date: new Date().toISOString(),
        category: "transfer",
        hash: generateTransactionHash(),
        toAddress,
        fromAddress: walletData.address
      }

      setWalletData(prev => ({
        ...prev,
        balance: prev.balance - amount,
        transactions: [newTransaction, ...prev.transactions]
      }))

      toast({
        title: "Withdrawal Successful",
        description: `Successfully withdrew ₹${amount.toLocaleString()}`,
      })

      return true
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "Failed to withdraw funds. Please try again.",
        variant: "destructive"
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [walletData.balance, walletData.address])

  // Refresh Balance
  const refreshBalance = useCallback(async () => {
    setIsLoading(true)
    try {
      await simulateBlockchainDelay()
      // In a real app, this would fetch from blockchain
      toast({
        title: "Balance Refreshed",
        description: "Wallet balance has been updated",
      })
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh balance. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Update Transaction Status
  const updateTransactionStatus = useCallback((transactionId: string, status: Transaction['status']) => {
    setWalletData(prev => ({
      ...prev,
      transactions: prev.transactions.map(tx => 
        tx.id === transactionId ? { ...tx, status } : tx
      )
    }))
  }, [])

  const value: WalletContextType = {
    walletData,
    isLoading,
    sendTransaction,
    receiveTransaction,
    addFunds,
    withdrawFunds,
    generateQRCode,
    refreshBalance,
    updateTransactionStatus,
    validateAddress,
    getTransactionHistory,
    getWalletStats
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
