"use client"

import { Waves } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-10 w-10",
    xl: "h-12 w-12"
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg", 
    xl: "text-xl"
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className={cn(
        "bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/30 shadow-lg flex items-center justify-center",
        sizeClasses[size]
      )}>
        <Waves className={cn("text-primary", sizeClasses[size])} />
      </div>
      {showText && (
        <span className={cn(
          "font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent",
          textSizeClasses[size]
        )}>
          Blue Carbon Registry
        </span>
      )}
    </div>
  )
}
