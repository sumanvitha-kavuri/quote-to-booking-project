"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Login() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleLogin = async () => {
    setErrorMsg("")

    if (!email || !password) {
      setErrorMsg("Enter email and password")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
      return
    }

    setLoading(false)

    // 🔥 redirect after login
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 flex flex-col items-center justify-center px-4">

      {/* BRAND */}
      <h1 className="text-xl font-semibold mb-6">
        <span className="text-gray-900">Quote</span>{" "}
        <span className="text-slate-700">to Booking</span>
      </h1>

      {/* CARD */}
      <div className="w-full max-w-md bg-white border rounded-2xl shadow-xl p-8 space-y-5">

        <h2 className="text-2xl font-semibold text-center">
          Welcome back
        </h2>

        <p className="text-sm text-gray-500 text-center">
          Login to your account
        </p>

        {/* INPUTS */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ERROR */}
        {errorMsg && (
          <p className="text-sm text-red-500">{errorMsg}</p>
        )}

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-slate-900 text-white py-3 rounded-lg text-lg font-medium hover:bg-slate-800 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* SIGNUP */}
        <p className="text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 font-medium hover:underline">
            Sign up
          </a>
        </p>

      </div>

      <p className="text-xs text-gray-400 mt-6">
        Secure login • Your data is safe
      </p>

    </div>
  )
}