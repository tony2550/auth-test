import { getCurrentSession } from "@/lib/lucia/session"
import { redirect } from "next/navigation"
import SignOutButton from "@/components/auth/lucia-signout-button"

export default async function LuciaDashboard() {
  const { session, user } = await getCurrentSession()

  if (!session) {
    redirect("/lucia/signin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-teal-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-emerald-800/50 backdrop-blur-sm border border-emerald-700 rounded-xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Lucia Dashboard</h1>
            <SignOutButton />
          </div>

          <div className="space-y-6">
            <div className="bg-emerald-900/50 border border-emerald-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Session Information</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-emerald-300 text-sm">Session ID:</span>
                  <p className="text-white font-mono text-sm break-all">{session.id}</p>
                </div>
                <div>
                  <span className="text-emerald-300 text-sm">User ID:</span>
                  <p className="text-white font-mono">{user.id}</p>
                </div>
                <div>
                  <span className="text-emerald-300 text-sm">Email:</span>
                  <p className="text-white">{user.email}</p>
                </div>
                <div>
                  <span className="text-emerald-300 text-sm">Name:</span>
                  <p className="text-white">{user.name || "Not set"}</p>
                </div>
                <div>
                  <span className="text-emerald-300 text-sm">Role:</span>
                  <p className="text-white">{user.role}</p>
                </div>
                <div>
                  <span className="text-emerald-300 text-sm">Expires:</span>
                  <p className="text-white">{new Date(session.expiresAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-900/50 border border-emerald-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Implementation Details</h2>
              <ul className="space-y-2 text-emerald-200">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Custom session management with Oslo.js
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  SHA-256 hashed session tokens (not stored in DB)
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  HttpOnly + Secure + SameSite cookies
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Bcrypt password hashing
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Automatic session extension (15 days before expiry)
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Failed login tracking
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Zero external auth dependencies
                </li>
              </ul>
            </div>

            <div className="bg-emerald-900/50 border border-emerald-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Security Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-950/50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-emerald-300 mb-2">Session Token</h3>
                  <p className="text-xs text-emerald-400">
                    Base32-encoded random 20-byte token, hashed with SHA-256 before storage
                  </p>
                </div>
                <div className="bg-emerald-950/50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-emerald-300 mb-2">Password Security</h3>
                  <p className="text-xs text-emerald-400">
                    Bcrypt with salt rounds of 10, never stored or transmitted in plain text
                  </p>
                </div>
                <div className="bg-emerald-950/50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-emerald-300 mb-2">Cookie Security</h3>
                  <p className="text-xs text-emerald-400">
                    HttpOnly, Secure in production, SameSite=Lax for CSRF protection
                  </p>
                </div>
                <div className="bg-emerald-950/50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-emerald-300 mb-2">Session Lifecycle</h3>
                  <p className="text-xs text-emerald-400">
                    30-day expiration, auto-extends when more than 15 days remaining
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-900/50 border border-emerald-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Full Session Data</h2>
              <pre className="bg-black/50 p-4 rounded overflow-auto text-sm text-emerald-300">
                {JSON.stringify({ session, user }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
