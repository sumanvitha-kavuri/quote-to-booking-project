"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AuthModal({ onClose }: { onClose: () => void }) {
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

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 animate-fadeIn">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl"
        >
          ✕
        </button>

        {/* BRAND */}
        <h1 className="text-lg font-bold mb-2 text-center">
          <span className="text-gray-900">Quote</span>{" "}
          <span className="text-blue-600">to Booking</span>
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Create your account and start booking faster
        </p>

        {/* FORM */}
        <div className="space-y-4">

          <input
            placeholder="Full Name"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Business Name"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setBusiness(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email (you@example.com)"
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
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

        </div>

        {/* LOGIN LINK */}
        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <button
            className="text-blue-600 font-medium hover:underline"
            onClick={() => {
              // later we will switch to login mode
              alert("Login modal coming next")
            }}
          >
            Login
          </button>
        </p>

      </div>
    </div>
  )
}