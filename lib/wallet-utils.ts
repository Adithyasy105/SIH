/**
 * Wallet utility functions for the Blue Carbon Registry
 */

// Types
export interface WalletAddress {
  address: string
  isValid: boolean
  network: string
}

export interface TransactionFee {
  gasPrice: number
  gasLimit: number
  totalFee: number
}

export interface WalletSecurity {
  isEncrypted: boolean
  hasBackup: boolean
  twoFactorEnabled: boolean
  lastBackup?: string
}

// Constants
export const WALLET_CONSTANTS = {
  MIN_ADDRESS_LENGTH: 10,
  MAX_ADDRESS_LENGTH: 50,
  DEFAULT_GAS_LIMIT: 21000,
  DEFAULT_GAS_PRICE: 20, // gwei
  SUPPORTED_NETWORKS: ['ethereum', 'polygon', 'bsc'],
  CURRENCY_SYMBOLS: {
    INR: '₹',
    USD: '$',
    EUR: '€',
    ETH: 'Ξ'
  }
} as const

// Address validation
export function validateWalletAddress(address: string): WalletAddress {
  const cleanAddress = address.trim()
  const isValid = Boolean(
    cleanAddress &&
    cleanAddress.length >= WALLET_CONSTANTS.MIN_ADDRESS_LENGTH &&
    cleanAddress.length <= WALLET_CONSTANTS.MAX_ADDRESS_LENGTH &&
    cleanAddress.startsWith('0x') &&
    /^[0-9a-fA-F]+$/.test(cleanAddress.slice(2))
  )

  return {
    address: cleanAddress,
    isValid,
    network: isValid ? 'ethereum' : 'unknown'
  }
}

// Transaction fee calculation
export function calculateTransactionFee(
  gasPrice: number = WALLET_CONSTANTS.DEFAULT_GAS_PRICE,
  gasLimit: number = WALLET_CONSTANTS.DEFAULT_GAS_LIMIT
): TransactionFee {
  const totalFee = (gasPrice * gasLimit) / 1e9 // Convert from gwei to ETH
  
  return {
    gasPrice,
    gasLimit,
    totalFee
  }
}

// Format currency
export function formatCurrency(
  amount: number,
  currency: keyof typeof WALLET_CONSTANTS.CURRENCY_SYMBOLS = 'INR',
  decimals: number = 2
): string {
  const symbol = WALLET_CONSTANTS.CURRENCY_SYMBOLS[currency]
  const formattedAmount = amount.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
  
  return `${symbol}${formattedAmount}`
}

// Generate transaction hash (mock)
export function generateTransactionHash(): string {
  const timestamp = Date.now().toString(16)
  const random = Math.random().toString(16).substr(2, 8)
  return `0x${timestamp}${random}`
}

// Generate wallet address (mock)
export function generateWalletAddress(): string {
  const random = Math.random().toString(16).substr(2, 40)
  return `0x${random}`
}

// Security utilities
export function checkWalletSecurity(): WalletSecurity {
  // Mock security check - in real app, this would check actual security status
  return {
    isEncrypted: true,
    hasBackup: true,
    twoFactorEnabled: true,
    lastBackup: new Date().toISOString()
  }
}

// Transaction status helpers
export function getTransactionStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-100'
    case 'pending':
      return 'text-yellow-600 bg-yellow-100'
    case 'failed':
      return 'text-red-600 bg-red-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function getTransactionTypeIcon(type: string): string {
  switch (type) {
    case 'credit':
      return '↗️'
    case 'debit':
      return '↙️'
    default:
      return '↔️'
  }
}

// Date formatting
export function formatTransactionDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  if (diffInHours < 48) return "Yesterday"
  
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Balance formatting
export function formatBalance(balance: number, showDecimals: boolean = true): string {
  if (balance >= 1000000) {
    return `${(balance / 1000000).toFixed(1)}M`
  } else if (balance >= 1000) {
    return `${(balance / 1000).toFixed(1)}K`
  } else {
    return balance.toLocaleString('en-IN', {
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0
    })
  }
}

// Error handling
export function getWalletErrorMessage(error: any): string {
  if (typeof error === 'string') return error
  
  if (error?.message) {
    switch (error.message) {
      case 'INSUFFICIENT_FUNDS':
        return 'Insufficient funds for this transaction'
      case 'INVALID_ADDRESS':
        return 'Invalid wallet address'
      case 'NETWORK_ERROR':
        return 'Network connection error. Please try again.'
      case 'TRANSACTION_FAILED':
        return 'Transaction failed. Please try again.'
      default:
        return error.message
    }
  }
  
  return 'An unexpected error occurred'
}

// Export all utilities
export const walletUtils = {
  validateWalletAddress,
  calculateTransactionFee,
  formatCurrency,
  generateTransactionHash,
  generateWalletAddress,
  checkWalletSecurity,
  getTransactionStatusColor,
  getTransactionTypeIcon,
  formatTransactionDate,
  formatBalance,
  getWalletErrorMessage
}
