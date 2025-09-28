"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import NGOWallet from "@/components/wallet/NGOWallet"

interface WalletModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function WalletModal({ open, onOpenChange }: WalletModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[100vw] h-[100vh] m-0 p-0 max-w-none max-h-none sm:w-[95vw] sm:h-[90vh] sm:max-w-5xl sm:m-auto sm:p-6 overflow-hidden">
        <div className="flex flex-col h-full max-h-full">
          <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-0">
            <NGOWallet />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


