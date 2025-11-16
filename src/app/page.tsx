import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Auth Testing Platform
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            A comprehensive testing environment for modern authentication solutions in Next.js
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <span className="px-4 py-2 bg-blue-600/20 border border-blue-500 text-blue-300 rounded-full text-sm">
              Next.js 16
            </span>
            <span className="px-4 py-2 bg-purple-600/20 border border-purple-500 text-purple-300 rounded-full text-sm">
              TypeScript
            </span>
            <span className="px-4 py-2 bg-emerald-600/20 border border-emerald-500 text-emerald-300 rounded-full text-sm">
              PostgreSQL
            </span>
          </div>
        </header>

        {/* Auth Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Auth.js */}
          <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-8 hover:border-blue-500 transition-all hover:shadow-xl hover:shadow-blue-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Auth.js v5</h2>
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <p className="text-zinc-300 mb-6">
              Industry-standard authentication with OAuth, credentials, and database sessions
            </p>
            <ul className="space-y-2 mb-8 text-sm text-zinc-400">
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Multiple OAuth providers
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                JWT & Database sessions
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Role-based access control
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Built-in CSRF protection
              </li>
            </ul>
            <div className="flex gap-3">
              <Link
                href="/auth-js/signin"
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center font-semibold transition-colors"
              >
                Try Demo
              </Link>
              <Link
                href="/auth-js/signup"
                className="px-4 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-semibold transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* better-auth */}
          <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-700 rounded-2xl p-8 hover:border-purple-500 transition-all hover:shadow-xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">better-auth</h2>
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p className="text-purple-200 mb-6">
              Modern, batteries-included auth with social login and 2FA support
            </p>
            <ul className="space-y-2 mb-8 text-sm text-purple-300">
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Social authentication
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Two-factor authentication
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Email verification
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                TypeScript-first API
              </li>
            </ul>
            <div className="flex gap-3">
              <Link
                href="/better-auth/signin"
                className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-center font-semibold transition-colors"
              >
                Try Demo
              </Link>
              <Link
                href="/better-auth/signup"
                className="px-4 py-3 bg-purple-700/50 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Lucia */}
          <div className="bg-emerald-800/30 backdrop-blur-sm border border-emerald-700 rounded-2xl p-8 hover:border-emerald-500 transition-all hover:shadow-xl hover:shadow-emerald-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Lucia Auth</h2>
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
            </div>
            <p className="text-emerald-200 mb-6">
              Lightweight, framework-agnostic auth with full control over your data
            </p>
            <ul className="space-y-2 mb-8 text-sm text-emerald-300">
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Zero external dependencies
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Custom session management
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Oslo.js cryptography
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Full implementation control
              </li>
            </ul>
            <div className="flex gap-3">
              <Link
                href="/lucia/signin"
                className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-center font-semibold transition-colors"
              >
                Try Demo
              </Link>
              <Link
                href="/lucia/signup"
                className="px-4 py-3 bg-emerald-700/50 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="pb-4 text-slate-400 font-semibold">Feature</th>
                  <th className="pb-4 text-blue-400 font-semibold">Auth.js v5</th>
                  <th className="pb-4 text-purple-400 font-semibold">better-auth</th>
                  <th className="pb-4 text-emerald-400 font-semibold">Lucia</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-700/50">
                  <td className="py-3">OAuth Providers</td>
                  <td className="py-3 text-green-400">✓ Built-in</td>
                  <td className="py-3 text-green-400">✓ Built-in</td>
                  <td className="py-3 text-yellow-400">○ Manual</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3">Email/Password</td>
                  <td className="py-3 text-green-400">✓</td>
                  <td className="py-3 text-green-400">✓</td>
                  <td className="py-3 text-green-400">✓</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3">Two-Factor Auth</td>
                  <td className="py-3 text-yellow-400">○ Plugin</td>
                  <td className="py-3 text-green-400">✓ Built-in</td>
                  <td className="py-3 text-yellow-400">○ Custom</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3">Session Strategy</td>
                  <td className="py-3">JWT / Database</td>
                  <td className="py-3">Cookie-based</td>
                  <td className="py-3">Custom</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3">TypeScript Support</td>
                  <td className="py-3 text-green-400">✓ Excellent</td>
                  <td className="py-3 text-green-400">✓ Excellent</td>
                  <td className="py-3 text-green-400">✓ Excellent</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3">Bundle Size</td>
                  <td className="py-3 text-yellow-400">Medium</td>
                  <td className="py-3 text-yellow-400">Medium</td>
                  <td className="py-3 text-green-400">Small</td>
                </tr>
                <tr>
                  <td className="py-3">Learning Curve</td>
                  <td className="py-3 text-green-400">Low</td>
                  <td className="py-3 text-green-400">Low</td>
                  <td className="py-3 text-yellow-400">Medium</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Features */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-600 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Security Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600/20 border border-red-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">CSRF Protection</h3>
              <p className="text-sm text-slate-400">Token-based request validation</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 border border-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Secure Cookies</h3>
              <p className="text-sm text-slate-400">HttpOnly, Secure, SameSite</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600/20 border border-purple-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Password Hashing</h3>
              <p className="text-sm text-slate-400">Bcrypt with salt rounds</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600/20 border border-emerald-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Audit Logging</h3>
              <p className="text-sm text-slate-400">Failed login tracking</p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Built With</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-6 py-3 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-lg">
              Next.js 16
            </span>
            <span className="px-6 py-3 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-lg">
              React 19
            </span>
            <span className="px-6 py-3 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-lg">
              TypeScript
            </span>
            <span className="px-6 py-3 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-lg">
              PostgreSQL
            </span>
            <span className="px-6 py-3 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-lg">
              Prisma ORM
            </span>
            <span className="px-6 py-3 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-lg">
              TailwindCSS
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
