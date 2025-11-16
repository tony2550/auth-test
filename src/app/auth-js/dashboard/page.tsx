import { auth, signOut } from "@/lib/auth-js/auth"
import { redirect } from "next/navigation"

export default async function AuthJsDashboard() {
  const session = await auth()

  if (!session) {
    redirect("/auth-js/signin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Auth.js Dashboard</h1>
            <form
              action={async () => {
                "use server"
                await signOut()
              }}
            >
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Session Information</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-zinc-400 text-sm">User ID:</span>
                  <p className="text-white font-mono">{session.user.id}</p>
                </div>
                <div>
                  <span className="text-zinc-400 text-sm">Email:</span>
                  <p className="text-white">{session.user.email}</p>
                </div>
                <div>
                  <span className="text-zinc-400 text-sm">Name:</span>
                  <p className="text-white">{session.user.name || "Not set"}</p>
                </div>
                <div>
                  <span className="text-zinc-400 text-sm">Role:</span>
                  <p className="text-white">{session.user.role}</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Features</h2>
              <ul className="space-y-2 text-zinc-300">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  JWT-based sessions
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Multiple OAuth providers (Google, GitHub)
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Credentials provider with bcrypt
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Role-based access control
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Failed login tracking
                </li>
              </ul>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Full Session Object</h2>
              <pre className="bg-black/50 p-4 rounded overflow-auto text-sm text-zinc-300">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
