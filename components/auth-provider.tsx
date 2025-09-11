"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "user" | "admin"

export interface User {
  id: string
  email: string
  role: UserRole
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("bus-tracker-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call - in real app, this would be actual authentication
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Demo credentials
    const validCredentials = [
      { email: "admin@amritsar.gov.in", password: "admin123", role: "admin" as UserRole },
      { email: "user@example.com", password: "user123", role: "user" as UserRole },
    ]

    const credential = validCredentials.find(
      (cred) => cred.email === email && cred.password === password && cred.role === role,
    )

    if (credential) {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: credential.email,
        role: credential.role,
        name: credential.role === "admin" ? "Admin User" : "Regular User",
      }

      setUser(newUser)
      localStorage.setItem("bus-tracker-user", JSON.stringify(newUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("bus-tracker-user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
