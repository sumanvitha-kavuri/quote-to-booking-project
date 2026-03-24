"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Login() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // ✅ SAFE redirect (runs once, no loop)
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        router.replace("/dashboard") // ✅ IMPORTANT
      }
    }

    checkSession()
  }, [router])

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

    // 🔥 ensure session is stored
    await supabase.auth.getSession()

    setLoading(false)

    router.replace("/dashboard") // ✅ NOT push
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleLogin()
      }}
      className="space-y-6"
    >

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Welcome back
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Login to your account
        </p>
      </div>

      <div className="space-y-4">

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

      </div>

      {errorMsg && (
        <p className="text-sm text-red-500 text-center">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

    </form>
  )
}