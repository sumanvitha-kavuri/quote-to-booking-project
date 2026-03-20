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

    // 🔥 VALIDATION
    if (!name || !business || !email || !password || !confirmPassword) {
      setErrorMsg("All fields are required")
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match")
      return
    }

    setLoading(true)

    // 🔥 STEP 1: CREATE AUTH USER
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

    // 🔥 STEP 2: INSERT INTO USERS TABLE
    const { error: dbError } = await supabase.from("users").insert({
      id: user.id,
      email: user.email,
      name: name,
      business_name: business,
      role: "owner",
    })

    if (dbError) {
      console.log(dbError)
      setErrorMsg("Failed to save user data")
      setLoading(false)
      return
    }

    setLoading(false)

    // 🔥 SUCCESS
    router.push("/login")
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
          Create your account
        </h2>

        <p className="text-sm text-gray-500 text-center">
          Start sending quotes and getting paid faster
        </p>

        {/* INPUTS */}
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

        {/* ERROR */}
        {errorMsg && (
          <p className="text-sm text-red-500">{errorMsg}</p>
        )}

        {/* BUTTON */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-slate-900 text-white py-3 rounded-lg text-lg font-medium hover:bg-slate-800 transition"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        {/* LOGIN */}
        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </a>
        </p>

      </div>

      <p className="text-xs text-gray-400 mt-6">
        No setup required • Works on mobile & desktop
      </p>

    </div>
  )
}