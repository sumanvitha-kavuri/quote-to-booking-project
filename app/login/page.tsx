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
  const [infoMsg, setInfoMsg] = useState("")

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.replace("/dashboard")
      }
    }
    checkSession()
  }, [router])

  const handleLogin = async () => {
    setErrorMsg("")
    setInfoMsg("")

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

    await supabase.auth.getSession()
    setLoading(false)
    router.replace("/dashboard")
  }

  const handleForgotPassword = async () => {
    setErrorMsg("")
    setInfoMsg("")

    if (!email) {
      setErrorMsg("Enter your email first")
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
      setErrorMsg(error.message)
    } else {
      setInfoMsg("Password reset email sent")
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleLogin()
      }}
      className="space-y-6"
    >
      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Welcome back
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Login to your account
        </p>
      </div>

      {/* INPUTS */}
      <div className="space-y-4">

        {/* EMAIL */}
        <div className="space-y-1">
          <p className="text-sm text-gray-700 font-medium">Email</p>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="space-y-1">
          <p className="text-sm text-gray-700 font-medium">Password</p>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* FORGOT PASSWORD */}
        <div className="text-right">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

      </div>

      {/* MESSAGES */}
      {errorMsg && (
        <p className="text-sm text-red-500 text-center">{errorMsg}</p>
      )}

      {infoMsg && (
        <p className="text-sm text-green-600 text-center">{infoMsg}</p>
      )}

      {/* BUTTON */}
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