"use client"

import { useState } from "react"
import Signup from "@/app/signup/page"
import Login from "@/app/login/page"

export default function AuthModal({ initialMode, onClose }: any) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode)

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black text-lg"
        >
          ✕
        </button>

        {mode === "login" ? (
          <>
            <Login />
            <p className="text-sm text-center mt-4 text-gray-500">
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-blue-600 font-medium"
              >
                Sign up
              </button>
            </p>
          </>
        ) : (
          <>
            <Signup />
            <p className="text-sm text-center mt-4 text-gray-500">
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-600 font-medium"
              >
                Login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}