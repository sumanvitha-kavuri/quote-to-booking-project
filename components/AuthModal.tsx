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

      {/* 🔥 BACKGROUND BLUR */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition"
        onClick={onClose}
      />

      {/* 🔥 BIG MODAL */}
      <div className="relative w-[90%] max-w-4xl h-[80vh] bg-white rounded-3xl shadow-2xl flex animate-fadeIn overflow-hidden">

        {/* LEFT EMPTY SPACE (for premium feel) */}
        <div className="hidden md:flex flex-1 bg-gray-50 items-center justify-center">
          <div className="text-center px-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Quote to Booking
            </h2>
            <p className="text-gray-500 text-sm">
              Send quotes. Get paid. Book faster.
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex-1 flex items-center justify-center px-10">

          <div className="w-full max-w-md space-y-6">

            {/* CLOSE */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-black text-xl"
            >
              ✕
            </button>

            {/* TITLE */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Create Account
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Start managing your quotes professionally
              </p>
            </div>

            {/* INPUTS */}
            <div className="space-y-4">

              <input
                placeholder="Full Name"
                className="w-full border-b p-3 outline-none focus:border-blue-600"
                onChange={(e) => setName(e.target.value)}
              />

              <input
                placeholder="Business Name"
                className="w-full border-b p-3 outline-none focus:border-blue-600"
                onChange={(e) => setBusiness(e.target.value)}
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full border-b p-3 outline-none focus:border-blue-600"
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full border-b p-3 outline-none focus:border-blue-600"
                onChange={(e) => setPassword(e.target.value)}
              />

            </div>

            {/* BUTTON */}
            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg text-lg font-medium hover:bg-gray-900 transition"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

            {/* LOGIN LINK */}
            <p className="text-sm text-gray-500 text-center">
              Already have an account?{" "}
              <button className="text-blue-600 font-medium hover:underline">
                Login
              </button>
            </p>

          </div>

        </div>

      </div>
    </div>
  )
}