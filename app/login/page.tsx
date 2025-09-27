"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Waves, Loader2 } from "lucide-react"
import { Eye, EyeOff } from "lucide-react"
import { mockApi } from "@/lib/mockApi"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(email, password)
    if (success) {
      router.push("/dashboard")
    } else {
      try {
        const users = await mockApi.getUsers()
        const u = users.find((usr) => usr.contactEmail.trim().toLowerCase() === email.trim().toLowerCase())
        if (u) {
          if (u.status === "pending") {
            setError("Your account is pending admin approval. You’ll be able to sign in once verified.")
            return
          }
          if (u.status === "rejected") {
            setError("Your application was rejected. Please contact the administrator for next steps.")
            return
          }
        }
      } catch {
        // ignore and fall back to generic message
      }
      setError("Invalid credentials. Please try again.")
    }
  }

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword("demo123")
    setError("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Waves className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your Blue Carbon Registry account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-2">Demo Accounts:</p>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>
                <strong>NGO:</strong> ngo1@example.com
              </p>
              <p>
                <strong>Panchayat:</strong> panchayat1@example.com
              </p>
              <p>
                <strong>Verifier:</strong> verifier@example.com
              </p>
              <p>
                <strong>Admin:</strong> admin@nccr.gov.in
              </p>
              <p className="mt-2">
                <strong>Password:</strong> demo123 (for all accounts)
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Button variant="secondary" size="sm" onClick={() => fillDemo("ngo1@example.com")}>
                Fill NGO
              </Button>
              <Button variant="secondary" size="sm" onClick={() => fillDemo("panchayat1@example.com")}>
                Fill Panchayat
              </Button>
              <Button variant="secondary" size="sm" onClick={() => fillDemo("verifier@example.com")}>
                Fill Verifier
              </Button>
              <Button variant="secondary" size="sm" onClick={() => fillDemo("admin@nccr.gov.in")}>
                Fill Admin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
