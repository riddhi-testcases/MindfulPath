"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("mindfulpath-user")
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        // Verify user still exists in backend
        verifyUser(userData.email)
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("mindfulpath-user")
      }
    }
    setLoading(false)
  }, [])

  const verifyUser = async (email) => {
    try {
      const response = await fetch(`/api/user?email=${encodeURIComponent(email)}`)
      if (response.ok) {
        const { user: verifiedUser } = await response.json()
        setUser(verifiedUser)
        localStorage.setItem("mindfulpath-user", JSON.stringify(verifiedUser))
      } else {
        // User not found in backend, clear local storage
        localStorage.removeItem("mindfulpath-user")
        setUser(null)
      }
    } catch (error) {
      console.error("Error verifying user:", error)
    }
  }

  const signIn = async (email, password) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "signin",
          email,
          password,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setUser(result.user)
        localStorage.setItem("mindfulpath-user", JSON.stringify(result.user))
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error("Sign in error:", error)
      return { success: false, error: "Network error. Please try again." }
    }
  }

  const signUp = async (email, password, name) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "signup",
          email,
          password,
          name,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setUser(result.user)
        localStorage.setItem("mindfulpath-user", JSON.stringify(result.user))
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error("Sign up error:", error)
      return { success: false, error: "Network error. Please try again." }
    }
  }

  const updateUser = async (updates) => {
    if (!user) return { success: false, error: "No user logged in" }

    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          updates,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setUser(result.user)
        localStorage.setItem("mindfulpath-user", JSON.stringify(result.user))
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error("Update user error:", error)
      return { success: false, error: "Network error. Please try again." }
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("mindfulpath-user")
    router.push("/auth")
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
