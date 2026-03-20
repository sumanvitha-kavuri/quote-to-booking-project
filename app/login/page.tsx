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
    router.push("/dashboard")
  }

  return (
    <div className="space-y-5">

      <h2 className="text-2xl font-semibold text-center">
        Welcome back
      </h2>

      <p className="text-sm text-gray-500 text-center">
        Login to your account
      </p>

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

      {errorMsg && (
        <p className="text-sm text-red-500">{errorMsg}</p>
      )}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-slate-900 text-white py-3 rounded-lg text-lg font-medium hover:bg-slate-800 transition"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

    </div>
  )
}