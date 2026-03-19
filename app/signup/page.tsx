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
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-100 flex flex-col items-center justify-center px-4">

      {/* LOGO / BRAND */}
      <h1 className="text-xl font-bold mb-6">
        <span className="text-gray-900">Quote</span>{" "}
        <span className="text-blue-600">to Booking</span>
      </h1>

      {/* CARD */}
      <div className="w-full max-w-md bg-white border rounded-2xl shadow-2xl p-8 space-y-5">

        <h2 className="text-2xl font-bold text-center">
          Create your account
        </h2>

        <p className="text-sm text-gray-500 text-center">
          Start sending quotes and getting paid faster
        </p>

        <input
          placeholder="Your Name"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Business Name"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setBusiness(e.target.value)}
        />

        <input
          placeholder="Email"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium shadow-md hover:bg-blue-700 transition"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </a>
        </p>

      </div>

      {/* FOOT NOTE */}
      <p className="text-xs text-gray-400 mt-6">
        No setup required • Works on mobile & desktop
      </p>

    </div>
  )
}