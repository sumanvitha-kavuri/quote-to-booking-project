"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

export default function Signup() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [business, setBusiness] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // ✅ FIXED strength logic
  const getStrength = (pass: string) => {
    let score = 0
    if (pass.length >= 6) score++
    if (pass.length >= 10) score++
    if (/[A-Z]/.test(pass)) score++
    if (/[0-9]/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass)) score++

    if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "33%" }
    if (score <= 4) return { label: "Medium", color: "bg-yellow-500", width: "66%" }
    return { label: "Strong", color: "bg-green-500", width: "100%" }
  }

  const strength = getStrength(password)

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

    const userId = data.user?.id

    if (!userId) {
      setErrorMsg("Signup failed. Try again.")
      setLoading(false)
      return
    }

    const { error: dbError } = await supabase.from("users").insert({
      id: userId,
      email,
      name,
      business_name: business,
    })

    if (dbError) {
      setErrorMsg(dbError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    router.push("/thank-you")
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

        {/* NAME */}
        <div className="space-y-1">
          <p className="text-sm text-gray-700 font-medium">Full Name</p>
          <input
            placeholder="Full Name"
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-slate-900 text-black"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* BUSINESS */}
        <div className="space-y-1">
          <p className="text-sm text-gray-700 font-medium">Business Name</p>
          <input
            placeholder="Business Name"
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-slate-900 text-black"
            onChange={(e) => setBusiness(e.target.value)}
          />
        </div>

        {/* EMAIL */}
        <div className="space-y-1">
          <p className="text-sm text-gray-700 font-medium">Email</p>
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-slate-900 text-black"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="space-y-1">
          <p className="text-sm text-gray-700 font-medium">Password</p>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border p-3 rounded-lg pr-12 outline-none focus:ring-2 focus:ring-slate-900 text-black"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* ✅ STRENGTH */}
          {password && (
            <div>
              <div className="h-2 bg-gray-200 rounded mt-2">
                <div
                  className={`h-2 rounded ${strength.color}`}
                  style={{ width: strength.width }}
                />
              </div>
              <p className="text-xs mt-1 text-gray-600">
                Strength: {strength.label}
              </p>
            </div>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="space-y-1">
          <p className="text-sm text-gray-700 font-medium">Confirm Password</p>

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full border p-3 rounded-lg pr-12 outline-none focus:ring-2 focus:ring-slate-900 text-black"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* ERROR */}
        {errorMsg && (
          <p className="text-sm text-red-500 text-center">{errorMsg}</p>
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