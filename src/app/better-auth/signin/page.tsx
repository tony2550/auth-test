"use client"

import { authClient } from "@/lib/better-auth/client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function BetterAuthSignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      })

      if (result.error) {
        setError(result.error.message || "Invalid email or password")
      } else {
        router.push("/better-auth/dashboard")
        router.refresh()
      }
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/better-auth/dashboard",
      })
    } catch (error: any) {
      setError(error.message || "OAuth sign in failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-800">
      <div className="w-full max-w-md">
        <div className="bg-purple-800/50 backdrop-blur-sm border border-purple-700 rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">better-auth</h1>
            <p className="text-purple-200">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-purple-900/50 border border-purple-700 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-purple-200 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-purple-900/50 border border-purple-700 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-purple-800/50 text-purple-300">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              type="button"
              onClick={() => handleOAuthSignIn("google")}
              className="px-4 py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuthSignIn("github")}
              className="px-4 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              GitHub
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <a
            href="/better-auth/signup"
            className="text-sm text-purple-300 hover:text-white transition-colors"
          >
            Don't have an account? <span className="font-semibold">Sign up</span>
          </a>
        </div>
      </div>
    </div>
  )
}
