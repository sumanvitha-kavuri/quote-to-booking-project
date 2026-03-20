"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Signup() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [business, setBusiness] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSignup = async () => {
    setErrorMsg("")

    if (!name || !business || !email || !password || !confirmPassword) {
      setErrorMsg("All fields are required")
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match")
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
      return
    }

    const user = data.user

    if (!user) {
      setErrorMsg("Signup failed")
      setLoading(false)
      return
    }

    const { error: dbError } = await supabase.from("users").insert({
      id: user.id,
      email: user.email,
      name: name,
      business_name: business,
      role: "owner",
    })

    if (dbError) {
      setErrorMsg("Failed to save user data")
      setLoading(false)
      return
    }

    setLoading(false)
    router.push("/dashboard")
  }

  return (
    <div className="space-y-5">

      <h2 className="text-2xl font-semibold text-center">
        Create your account
      </h2>

      <p className="text-sm text-gray-500 text-center">
        Start sending quotes and getting paid faster
      </p>

      <input
        placeholder="Full Name"
        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Business Name"
        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
        onChange={(e) => setBusiness(e.target.value)}
      />

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

      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {errorMsg && (
        <p className="text-sm text-red-500">{errorMsg}</p>
      )}

      <button
        onClick={handleSignup}
        disabled={loading}
        className="w-full bg-slate-900 text-white py-3 rounded-lg text-lg font-medium hover:bg-slate-800 transition"
      >
        {loading ? "Creating..." : "Create Account"}
      </button>

    </div>
  )
}