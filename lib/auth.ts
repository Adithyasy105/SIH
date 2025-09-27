import type { User } from "./mockApi"
import { mockApi } from "./mockApi"

// Simple auth context for demo purposes
export interface AuthUser extends User {
  isAuthenticated: boolean
}

export const mockLogin = async (email: string, password: string): Promise<AuthUser | null> => {
  // Mock login - in real app this would validate credentials
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const users = await mockApi.getUsers()
  const found = users.find((u) => u.contactEmail.trim().toLowerCase() === email.trim().toLowerCase())
  if (!found) return null

  // seeded demo accounts may not have password defined; treat "demo123" as default
  const expectedPassword = found.password ?? "demo123"
  if (password !== expectedPassword) return null

  if (found.status !== "verified") {
    return null
  }

  return { ...found, isAuthenticated: true }
}
