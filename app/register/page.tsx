"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Waves, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react"
import { mockApi } from "@/lib/mockApi"

type UserRole = "NGO" | "Panchayat" | "Verifier"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<UserRole | "">("")
  const [formData, setFormData] = useState({
    name: "",
    contactEmail: "",
    contactPhone: "",
    documents: [] as string[],
    jurisdiction: "",
    // NGO specific
    registrationNumber: "",
    website: "",
    // Panchayat specific
    govtId: "",
    panchayatCode: "",
    // Verifier specific
    license: "",
    organization: "",
    expertise: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const roleParam = searchParams.get("role") as UserRole
    if (roleParam && ["NGO", "Panchayat", "Verifier"].includes(roleParam)) {
      setRole(roleParam)
      setStep(2)
    }
  }, [searchParams])

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole)
    setStep(2)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) return

    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    setError("")

    try {
      await mockApi.registerUser({
        role,
        name: formData.name,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        documents: ["registration.pdf"], // Mock document
        jurisdiction: formData.jurisdiction,
        password: formData.password,
      })
      setSuccess(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Registration Successful!</CardTitle>
            <CardDescription>Your account is pending admin approval</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Thank you for registering as a <strong>{role}</strong>. Your account will be reviewed by the NCCR Admin
              team and you'll receive an email notification once approved.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/login">Go to Login</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Waves className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Join Blue Carbon Registry</CardTitle>
          <CardDescription>{step === 1 ? "Choose your role to get started" : `Register as ${role}`}</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center space-y-2 bg-transparent"
                  onClick={() => handleRoleSelect("NGO")}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold">NGO</span>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">NGO</div>
                    <div className="text-xs text-muted-foreground">Environmental Organization</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center space-y-2 bg-transparent"
                  onClick={() => handleRoleSelect("Panchayat")}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">GP</span>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Panchayat</div>
                    <div className="text-xs text-muted-foreground">Local Government</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center space-y-2 bg-transparent"
                  onClick={() => handleRoleSelect("Verifier")}
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold">VF</span>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Verifier</div>
                    <div className="text-xs text-muted-foreground">Independent Expert</div>
                  </div>
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {role === "NGO"
                      ? "Organization Name"
                      : role === "Panchayat"
                        ? "Panchayat Name"
                        : "Organization Name"}{" "}
                    *
                  </Label>
                  <Input
                    id="name"
                    placeholder={`Enter ${role === "NGO" ? "NGO" : role} name`}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone *</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jurisdiction">
                    {role === "Panchayat" ? "Jurisdiction Area" : "Operating Region"} *
                  </Label>
                  <Input
                    id="jurisdiction"
                    placeholder={role === "Panchayat" ? "e.g., Sundarbans" : "e.g., West Bengal"}
                    value={formData.jurisdiction}
                    onChange={(e) => handleInputChange("jurisdiction", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Role-specific fields */}
              {role === "NGO" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="regNumber">Registration Number</Label>
                    <Input
                      id="regNumber"
                      placeholder="NGO registration number"
                      value={formData.registrationNumber}
                      onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://your-ngo.org"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {role === "Panchayat" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="govtId">Government ID</Label>
                    <Input
                      id="govtId"
                      placeholder="Official government ID"
                      value={formData.govtId}
                      onChange={(e) => handleInputChange("govtId", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panchayatCode">Panchayat Code</Label>
                    <Input
                      id="panchayatCode"
                      placeholder="Official panchayat code"
                      value={formData.panchayatCode}
                      onChange={(e) => handleInputChange("panchayatCode", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {role === "Verifier" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="license">License/Certification</Label>
                    <Input
                      id="license"
                      placeholder="Professional license number"
                      value={formData.license}
                      onChange={(e) => handleInputChange("license", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expertise">Area of Expertise</Label>
                    <Input
                      id="expertise"
                      placeholder="e.g., Marine Biology, Carbon Assessment"
                      value={formData.expertise}
                      onChange={(e) => handleInputChange("expertise", e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
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
                  <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="sm:w-auto">
                  Back
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
