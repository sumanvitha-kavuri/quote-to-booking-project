"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AuthModal({ onClose }: { onClose: () => void }) {

  const [name, setName] = useState("")
  const [business, setBusiness] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // 🔥 EMAIL SIGNUP
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

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
      return
    }

    // 👉 next step: save to DB (we'll do next)
    console.log({ name, business, email })

    onClose()
  }

  // 🔥 GOOGLE SIGNUP
  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-[90%] max-w-4xl h-[80vh] bg-white rounded-3xl shadow-2xl flex overflow-hidden">

        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-12 flex-col justify-between">

          <div>
            <h2 className="text-3xl font-bold mb-4">
              Quote to Booking
            </h2>

            <p className="text-sm opacity-90">
              Turn quotes into confirmed jobs without chasing customers.
            </p>
          </div>

          <div className="space-y-3 text-sm opacity-90">
            <p>✔ Send quotes instantly</p>
            <p>✔ Track responses in real-time</p>
            <p>✔ Collect deposits securely</p>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex items-center justify-center px-10">

          <div className="w-full max-w-md space-y-5">

            {/* CLOSE */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-black text-xl"
            >
              ✕
            </button>

            {/* TITLE */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Create Account
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Set up your business profile
              </p>
            </div>

            {/* FORM */}
            <div className="space-y-4">

              <div>
                <p className="text-sm text-gray-500 mb-1">Full Name</p>
                <input
                  className="w-full border-b p-2 outline-none focus:border-blue-600"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Business Name</p>
                <input
                  className="w-full border-b p-2 outline-none focus:border-blue-600"
                  onChange={(e) => setBusiness(e.target.value)}
                />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <input
                  type="email"
                  className="w-full border-b p-2 outline-none focus:border-blue-600"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Password</p>
                <input
                  type="password"
                  className="w-full border-b p-2 outline-none focus:border-blue-600"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Confirm Password</p>
                <input
                  type="password"
                  className="w-full border-b p-2 outline-none focus:border-blue-600"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

            </div>

            {/* ERROR */}
            {errorMsg && (
              <p className="text-sm text-red-500">{errorMsg}</p>
            )}

            {/* BUTTON */}
            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

            {/* DIVIDER */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <p className="text-xs text-gray-400">OR</p>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* GOOGLE */}
            <button
              onClick={handleGoogle}
              className="w-full border py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            {/* LOGIN */}
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