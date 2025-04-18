// components/auth/LoginForm.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import axios from "axios"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/context/UseAuth"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    setError("")
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, values)
      
      if (response.data.data.user) {
        const { user } = response.data.data
        await login(user)
        
        toast.success("Welcome back!", {
          description: `You've successfully signed in`,
        })

        navigate(user.roles.includes('admin') ? '/admin/dashboard' : '/dashboard')
      }
    }  catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Invalid credentials"
        setError(message)
        toast.error("Login failed", {
          description: message,
        })
      }else {
        console.log(error);
      }
      }finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
              <p className="text-muted-foreground">
                Enter your credentials to access your account
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your@email.com" 
                          {...field} 
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Password</FormLabel>
                        <Button
                          variant="link"
                          size="sm"
                          className="px-0 text-muted-foreground hover:text-primary"
                          asChild
                        >
                          <Link to="/forgot-password">Forgot password?</Link>
                        </Button>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Form>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button 
                variant="link" 
                size="sm" 
                className="text-primary px-1"
                asChild
              >
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}