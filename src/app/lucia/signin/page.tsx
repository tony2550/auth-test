"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LuciaSignInPage() {
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
      const response = await fetch("/api/lucia/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Sign in failed")
      }

      router.push("/lucia/dashboard")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 to-teal-800">
      <div className="w-full max-w-md">
        <div className="bg-emerald-800/50 backdrop-blur-sm border border-emerald-700 rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Lucia Auth</h1>
            <p className="text-emerald-200">Custom Session Management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-emerald-200 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-emerald-900/50 border border-emerald-700 rounded-lg text-white placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-emerald-200 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-emerald-900/50 border border-emerald-700 rounded-lg text-white placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
              className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6">
            <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-4">
              <p className="text-xs text-emerald-300 mb-2 font-semibold">Implementation Details:</p>
              <ul className="text-xs text-emerald-400 space-y-1">
                <li>• Custom session management with Oslo.js</li>
                <li>• SHA-256 hashed session tokens</li>
                <li>• HttpOnly secure cookies</li>
                <li>• No external auth libraries</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <a
            href="/lucia/signup"
            className="text-sm text-emerald-300 hover:text-white transition-colors"
          >
            Don't have an account? <span className="font-semibold">Sign up</span>
          </a>
        </div>
      </div>
    </div>
  )
}
