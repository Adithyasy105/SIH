"use client"

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Waves, Wallet } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await logout() // logs out and redirects
    } catch (err) {
      console.error("Logout failed", err)
      setIsLoggingOut(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border/30 bg-background/95 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex h-14 sm:h-16 md:h-20 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 md:space-x-3 group">
            <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-lg overflow-hidden border border-primary/30 shadow bg-white">
              <Image src="/logo.jpg" alt="Logo" fill sizes="40px" className="object-cover" />
            </div>
            <span className="font-bold text-base sm:text-lg md:text-2xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              <span className="hidden sm:inline">Blue Carbon Registry</span>
              <span className="sm:hidden">BCR</span>
            </span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                {/* Wallet Link */}
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:bg-primary/10 transition-all duration-300"
                >
                  <Link href="/dashboard/wallet">
                    <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </Link>
                </Button>

                {/* Avatar */}
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-xs sm:text-sm">
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Logout button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-xs sm:text-sm"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" className="text-xs sm:text-sm" asChild>
                  <Link href="/register">
                    <span className="hidden sm:inline">Register</span>
                    <span className="sm:hidden">Join</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wallet modal removed; using page route */}
    </nav>
  )
}
