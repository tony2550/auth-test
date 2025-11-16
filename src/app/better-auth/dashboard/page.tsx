"use client"

import { useSession, authClient } from "@/lib/better-auth/client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function BetterAuthDashboard() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/better-auth/signin")
    }
  }, [session, isPending, router])

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/better-auth/signin")
    router.refresh()
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-purple-800/50 backdrop-blur-sm border border-purple-700 rounded-xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">better-auth Dashboard</h1>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-purple-900/50 border border-purple-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Session Information</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-purple-300 text-sm">User ID:</span>
                  <p className="text-white font-mono">{session.user?.id}</p>
                </div>
                <div>
                  <span className="text-purple-300 text-sm">Email:</span>
                  <p className="text-white">{session.user?.email}</p>
                </div>
                <div>
                  <span className="text-purple-300 text-sm">Name:</span>
                  <p className="text-white">{session.user?.name || "Not set"}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/50 border border-purple-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Features</h2>
              <ul className="space-y-2 text-purple-200">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Email and password authentication
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Social login (Google, GitHub)
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Session management with cookies
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Built-in CSRF protection
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">○</span>
                  2FA support (available, not configured)
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">○</span>
                  Email verification (available, not configured)
                </li>
              </ul>
            </div>

            <div className="bg-purple-900/50 border border-purple-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Full Session Object</h2>
              <pre className="bg-black/50 p-4 rounded overflow-auto text-sm text-purple-200">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
