"use client"

import {useState, useMemo, useCallback} from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  Eye,
  EyeOff,
  RefreshCw,
  Copy,
  CheckCircle,
  XCircle,
  ArrowDown,
  ArrowUp,
  Wallet as WalletIcon,
  Send,
  Banknote,
} from "lucide-react"

type TransactionStatus = "success" | "failed" | "pending"
type TransactionType = "incoming" | "outgoing"
// Solana: SOL and a single Token-2022 mint (generic name TOKEN22)
type TokenSymbol = "SOL" | "TOKEN22"

interface TransactionItem {
  id: string
  type: TransactionType
  counterparty: string
  amount: number
  token: TokenSymbol
  inrValue: number
  status: TransactionStatus
  date: string
  hash: string
  fee?: number // network fee in token units for ETH, or USDC fee for token transfers
}

interface UseNGOWalletResult {
  address: string
  isActive: boolean
  balanceSol: number
  balanceToken: number
  inrPerSol: number
  inrPerToken: number
  tokenMintLabel: string
  transactions: TransactionItem[]
  refreshBalance: () => Promise<void>
  sendTransaction: (to: string, amount: number, token: TokenSymbol) => Promise<boolean>
  withdrawFunds: (method: "bank" | "upi", amount: number, currency: "INR" | "TOKEN22") => Promise<boolean>
}

// Mock embedded wallet hook (no external provider)
function useNGOWallet(): UseNGOWalletResult {
  // derive per-user seed from auth-user; fall back to random
  const stored = typeof window !== "undefined" ? localStorage.getItem("auth-user") : null
  const suffix = stored ? (() => { try { const u = JSON.parse(stored); return (u?.email || u?.name || "user").slice(0,8) } catch { return "user" }})() : "user"
  // very simple pseudo Solana address (base58-ish mock)
  const [address] = useState<string>(() => `SoL${btoa(`${suffix}-${Math.random().toString(36).slice(2,6)}`).replace(/[^A-Za-z0-9]/g, "").slice(0,36).padEnd(36,"X")}`)
  const [isActive] = useState<boolean>(true)
  const [balanceSol, setBalanceSol] = useState<number>(3.125)
  const [balanceToken, setBalanceToken] = useState<number>(1250.5)
  const [transactions, setTransactions] = useState<TransactionItem[]>(() => [
    {
      id: "t1",
      type: "incoming",
      counterparty: "SoL9a...f4c2",
      amount: 0.85,
      token: "SOL",
      inrValue: 0,
      status: "success",
      date: new Date(Date.now() - 3600 * 1000).toISOString(),
      hash: `0x${Math.random().toString(16).slice(2).padEnd(64, "0")}`,
    },
    {
      id: "t2",
      type: "outgoing",
      counterparty: "SoL8b...91af",
      amount: 220,
      token: "TOKEN22",
      inrValue: 0,
      status: "pending",
      date: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      hash: `0x${Math.random().toString(16).slice(2).padEnd(64, "0")}`,
    },
  ])

  // Static mock rates for Solana
  const inrPerSol = 13000
  const inrPerToken = 84
  const tokenMintLabel = "Token-2022"

  // fill INR values lazily
  const txWithInr = useMemo(() =>
    transactions.map(t => ({
      ...t,
      inrValue: t.token === "SOL" ? t.amount * inrPerSol : t.amount * inrPerToken,
    })),
  [transactions, inrPerSol, inrPerToken])

  const refreshBalance = useCallback(async () => {
    await new Promise(r => setTimeout(r, 800))
    // tiny jitter to simulate refresh
    setBalanceSol(prev => Math.max(0, +(prev + (Math.random() - 0.5) * 0.02).toFixed(4)))
    setBalanceToken(prev => Math.max(0, +(prev + (Math.random() - 0.5) * 5).toFixed(2)))
    toast({ title: "Balance refreshed" })
  }, [])

  const sendTransaction = useCallback(async (to: string, amount: number, token: TokenSymbol) => {
    // very light Solana address validation (base58-ish length)
    if (!to || to.length < 30) {
      toast({ title: "Invalid address", description: "Enter a valid Solana address.", variant: "destructive" })
      return false
    }
    if (amount <= 0) {
      toast({ title: "Invalid amount", description: "Enter a positive amount.", variant: "destructive" })
      return false
    }
    // balance check
    if (token === "SOL" && amount > balanceSol) {
      toast({ title: "Insufficient SOL", variant: "destructive" })
      return false
    }
    if (token === "TOKEN22" && amount > balanceToken) {
      toast({ title: `${tokenMintLabel} balance too low`, variant: "destructive" })
      return false
    }
    // simulate pending then mined with fee
    const id = `tx_${Date.now()}`
    const hash = `0x${Math.random().toString(16).slice(2).padEnd(64, "0")}`
    // simulate Solana fees ~ 0.000005 - 0.00002 SOL
    const solFee = +(0.000005 + Math.random() * 0.000015).toFixed(6)
    const tokenFeeSol = 0.000006

    setTransactions(prev => [{
      id,
      type: "outgoing",
      counterparty: `${to.slice(0, 6)}...${to.slice(-4)}`,
      amount,
      token,
      inrValue: 0,
      status: "pending",
      date: new Date().toISOString(),
      hash,
    }, ...prev])

    // simulate network confirmation
    setTimeout(() => {
      setTransactions(prev => prev.map(t => t.id === id ? {
        ...t,
        status: "success",
        fee: token === "SOL" ? solFee : tokenFeeSol,
      } : t))
      if (token === "SOL") setBalanceSol(prev => +(prev - amount - solFee))
      else setBalanceToken(prev => +(prev - amount))
      // deduct token fee in SOL for token transfers
      if (token === "TOKEN22") setBalanceSol(prev => +(prev - tokenFeeSol))
      toast({ title: "Transaction confirmed", description: `${amount} ${token === "SOL" ? "SOL" : tokenMintLabel} sent` })
    }, 1500)
    return true
  }, [balanceSol, balanceToken, tokenMintLabel])

  const withdrawFunds = useCallback(async (method: "bank" | "upi", amount: number, currency: "INR" | "TOKEN22") => {
    if (amount <= 0) {
      toast({ title: "Invalid amount", variant: "destructive" })
      return false
    }
    const id = `wd_${Date.now()}`
    const hash = `0x${Math.random().toString(16).slice(2).padEnd(64, "0")}`
    setTransactions(prev => [{
      id,
      type: "outgoing",
      counterparty: method === "bank" ? "BANK" : "UPI",
      amount,
      token: currency === "TOKEN22" ? "TOKEN22" : "SOL",
      inrValue: 0,
      status: "pending",
      date: new Date().toISOString(),
      hash,
    }, ...prev])
    setTimeout(() => {
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: "success" } : t))
      toast({ title: "Withdrawal completed", description: `${currency} ${amount} via ${method.toUpperCase()}` })
    }, 1400)
    return true
  }, [])

  return {
    address,
    isActive,
    balanceSol,
    balanceToken,
    inrPerSol,
    inrPerToken,
    tokenMintLabel,
    transactions: txWithInr,
    refreshBalance,
    sendTransaction,
    withdrawFunds,
  }
}

function shorten(addr: string) {
  return addr.length > 12 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr
}

export default function NGOWallet() {
  const {
    address,
    isActive,
    balanceSol,
    balanceToken,
    inrPerSol,
    inrPerToken,
    tokenMintLabel,
    transactions,
    refreshBalance,
    sendTransaction,
    withdrawFunds,
  } = useNGOWallet()

  const [showBalance, setShowBalance] = useState(true)
  const [sending, setSending] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)

  // Send modal state
  const [sendOpen, setSendOpen] = useState(false)
  const [sendTo, setSendTo] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  const [sendToken, setSendToken] = useState<TokenSymbol>("SOL")

  // Withdraw modal state
  const [wdOpen, setWdOpen] = useState(false)
  const [wdMethod, setWdMethod] = useState<"bank" | "upi">("bank")
  const [wdAmount, setWdAmount] = useState("")
  const [wdCurrency, setWdCurrency] = useState<"INR" | "USDC">("INR")

  const totalInr = useMemo(() => balanceSol * inrPerSol + balanceToken * inrPerToken, [balanceSol, inrPerSol, balanceToken, inrPerToken])

  const onCopy = async () => {
    await navigator.clipboard.writeText(address)
    toast({ title: "Address copied" })
  }

  const onRefresh = async () => {
    await refreshBalance()
  }

  const onConfirmSend = async () => {
    const amount = parseFloat(sendAmount)
    if (Number.isNaN(amount)) {
      toast({ title: "Enter a valid amount", variant: "destructive" })
      return
    }
    setSending(true)
    const ok = await sendTransaction(sendTo.trim(), amount, sendToken)
    setSending(false)
    if (ok) {
      setSendOpen(false)
      setSendTo("")
      setSendAmount("")
    }
  }

  const onConfirmWithdraw = async () => {
    const amount = parseFloat(wdAmount)
    if (Number.isNaN(amount)) {
      toast({ title: "Enter a valid amount", variant: "destructive" })
      return
    }
    setWithdrawing(true)
    // Fix: Cast wdCurrency to the expected type for withdrawFunds
    const ok = await withdrawFunds(wdMethod, amount, wdCurrency === "USDC" ? "TOKEN22" : wdCurrency)
    setWithdrawing(false)
    if (ok) {
      setWdOpen(false)
      setWdAmount("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Responsive grid: Overview | Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Overview */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <WalletIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Wallet Balance</CardTitle>
                    <CardDescription>Embedded Solana Wallet</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowBalance(s => !s)}>
                    {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRefresh}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className={cn("text-xl font-bold", !showBalance && "blur-sm select-none")}>SOL {balanceSol.toFixed(4)}</div>
                  <div className={cn("text-sm text-muted-foreground", !showBalance && "blur-sm select-none")}>
                    ≈ ₹{(balanceSol * inrPerSol).toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <div className={cn("text-xl font-bold", !showBalance && "blur-sm select-none")}>{tokenMintLabel} {balanceToken.toFixed(2)}</div>
                  <div className={cn("text-sm text-muted-foreground", !showBalance && "blur-sm select-none")}>
                    ≈ ₹{(balanceToken * inrPerToken).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="secondary" className={cn(isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700")}>{isActive ? "Active" : "Inactive"}</Badge>
                <div className="text-sm text-muted-foreground">Total ≈ ₹{totalInr.toLocaleString("en-IN")}</div>
              </div>

              <div className="p-2 rounded-lg bg-muted/40">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono break-all text-muted-foreground">{address}</div>
                  <Button size="sm" variant="ghost" className="h-7 px-2" onClick={onCopy}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Actions</CardTitle>
              <CardDescription>Transfer or withdraw funds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Dialog open={sendOpen} onOpenChange={setSendOpen}>
                  <DialogTrigger asChild>
                    <Button className="h-12 gap-2">
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Send Tokens (Solana)</DialogTitle>
                      <DialogDescription>Transfer to another Solana address</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="to">Recipient Address</Label>
                        <Input id="to" placeholder="0x..." value={sendTo} onChange={e => setSendTo(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="amt">Amount</Label>
                          <Input id="amt" type="number" placeholder="0.00" value={sendAmount} onChange={e => setSendAmount(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label>Token</Label>
                          <Select value={sendToken} onValueChange={(v) => setSendToken(v as TokenSymbol)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select token" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SOL">SOL</SelectItem>
                              <SelectItem value="TOKEN22">{tokenMintLabel}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setSendOpen(false)}>Cancel</Button>
                        <Button onClick={onConfirmSend} disabled={sending}>{sending ? "Sending..." : "Confirm"}</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={wdOpen} onOpenChange={setWdOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-12 gap-2">
                      <Banknote className="h-4 w-4" />
                      Withdraw
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Withdraw</DialogTitle>
                      <DialogDescription>Move funds to bank/UPI</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label>Method</Label>
                          <Select value={wdMethod} onValueChange={(v) => setWdMethod(v as ("bank"|"upi"))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bank">Bank</SelectItem>
                              <SelectItem value="upi">UPI</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label>Currency</Label>
                          <Select value={wdCurrency} onValueChange={(v) => setWdCurrency(v as ("INR"|"USDC"))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="INR">INR</SelectItem>
                              <SelectItem value="USDC">USDC</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="wdAmt">Amount</Label>
                        <Input id="wdAmt" type="number" placeholder="0.00" value={wdAmount} onChange={e => setWdAmount(e.target.value)} />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setWdOpen(false)}>Cancel</Button>
                        <Button onClick={onConfirmWithdraw} disabled={withdrawing}>{withdrawing ? "Submitting..." : "Confirm"}</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions */}
        <div className="lg:col-span-2">
          <Card className="border-2 hover:border-primary/20 transition-colors h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Recent Transactions</CardTitle>
                  <CardDescription>Latest wallet activity</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={onRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[360px]">
                <div className="divide-y">
                  {transactions.length === 0 && (
                    <div className="p-6 text-sm text-muted-foreground">No transactions yet</div>
                  )}
                  {transactions.map((t) => (
                    <div key={t.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-9 w-9 rounded-full flex items-center justify-center",
                          t.type === "incoming" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                          {t.type === "incoming" ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {t.type === "incoming" ? "Incoming" : "Outgoing"} • {t.token} {t.amount}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {shorten(t.counterparty)} • ₹{t.inrValue.toLocaleString("en-IN")} • {new Date(t.date).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div>
                        {t.status === "success" && (
                          <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Success</Badge>
                        )}
                        {t.status === "failed" && (
                          <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>
                        )}
                        {t.status === "pending" && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


