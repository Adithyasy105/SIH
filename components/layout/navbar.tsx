"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Waves, User, LogOut } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    logout() // clears user & redirects to /login
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border/30 bg-background/95 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex h-14 sm:h-16 md:h-20 items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 md:space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
              <div className="relative p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/30 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Waves className="h-6 w-6 text-primary" />
              </div>
            </div>
            <span className="font-bold text-lg md:text-2xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Blue Carbon Registry
            </span>
          </Link>

          {/* Right Side: User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-primary/10 transition-all duration-300">
                    <Avatar className="h-8 w-8 border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48 p-2" align="end" forceMount>
                  <div className="px-3 py-2 border-b border-border/50">
                    <div className="font-semibold text-sm truncate">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.role}</div>
                  </div>

                  <DropdownMenuItem asChild className="px-3 py-2 my-1 rounded-md hover:bg-primary/5">
                    <Link href="/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span className="text-sm">Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    disabled={isLoggingOut}
                    className="flex items-center px-3 py-2 my-1 rounded-md hover:bg-destructive/10 text-destructive hover:text-destructive-foreground disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="text-sm font-semibold">
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}
