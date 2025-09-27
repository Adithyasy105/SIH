"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type AuthUser, mockLogin } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem("auth-user")
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      if (parsed?.status === "verified") {
        setUser(parsed)
      } else {
        localStorage.removeItem("auth-user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    try {
      const authUser = await mockLogin(email, password)
      if (authUser) {
        setUser(authUser)
        localStorage.setItem("auth-user", JSON.stringify(authUser))
        return true
      }
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth-user")
    // Force a page refresh to ensure clean state
    window.location.href = "/login"
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
