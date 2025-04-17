"use client"

import { createContext, useState, useEffect, type ReactNode, useCallback } from "react"
import axios from "axios"

interface User {
  id: number
  name: string
  email: string
  roles: string[]
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>
  logout: () => void
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL ;
      const response = await axios.get(`${apiUrl}/user`)
      setUser(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch user:", error)
      logout()
      setLoading(false)
    }
  }, [setUser, setLoading])

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token,fetchUser])



  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const apiUrl = import.meta.env.VITE_API_URL ;
      const response = await axios.post(`${apiUrl}/login`, {
        email,
        password,
      })
      const { token } = response.data
      localStorage.setItem("token", token)
      setToken(token)
    } catch (error) {
      setError("Invalid credentials")
      setLoading(false)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post(`${process.env.VITE_API_URL}/api/register`, {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      const { token } = response.data
      localStorage.setItem("token", token)
      setToken(token)
    } catch (error) {
      setError("Registration failed")
      setLoading(false)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common["Authorization"]
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}



export { AuthContext };