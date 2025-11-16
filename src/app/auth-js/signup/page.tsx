import { auth } from "@/lib/auth-js/auth"
import { redirect } from "next/navigation"
import SignUpForm from "@/components/auth/authjs-signup-form"

export default async function AuthJsSignUpPage() {
  const session = await auth()

  if (session) {
    redirect("/auth-js/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800">
      <div className="w-full max-w-md">
        <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Auth.js v5</h1>
            <p className="text-zinc-400">Create your account</p>
          </div>
          <SignUpForm />
        </div>
        <div className="mt-4 text-center">
          <a
            href="/auth-js/signin"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Already have an account? <span className="font-semibold">Sign in</span>
          </a>
        </div>
      </div>
    </div>
  )
}
