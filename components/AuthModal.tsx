"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [business, setBusiness] = useState("")
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

      {/* 🔥 BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 🔥 MODAL */}
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden grid grid-cols-2 animate-fadeIn">

        {/* LEFT SIDE */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-10">
          <div>
            <h2 className="text-3xl font-bold mb-4">Welcome 👋</h2>
            <p className="text-sm opacity-90">
              Start turning quotes into booked jobs.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-8 space-y-4">

          <h2 className="text-xl font-bold">Create Account</h2>

          <input
            placeholder="Your Name"
            className="w-full border-b p-2 outline-none"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Business Name"
            className="w-full border-b p-2 outline-none"
            onChange={(e) => setBusiness(e.target.value)}
          />

          <input
            placeholder="Email"
            className="w-full border-b p-2 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border-b p-2 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleSignup}
            className="w-full bg-black text-white py-3 rounded-lg mt-4"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

        </div>

      </div>
    </div>
  )
}