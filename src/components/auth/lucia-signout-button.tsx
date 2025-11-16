"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignOutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await fetch("/api/lucia/signout", { method: "POST" })
      router.push("/lucia/signin")
      router.refresh()
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
    >
      {loading ? "Signing out..." : "Sign Out"}
    </button>
  )
}
