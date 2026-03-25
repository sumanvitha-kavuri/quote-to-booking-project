"use client"

import { useState } from "react"
import AuthModal from "@/components/AuthModal"

export default function Home() {

  const [showModal, setShowModal] = useState(false)
  const [mode, setMode] = useState<"login" | "signup">("login")

  // 🔥 CENTRAL HANDLER (fixes click issues)
  const openModal = (type: "login" | "signup") => {
    setMode(type)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col relative">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-4 sm:px-8 py-5 border-b border-white/10 backdrop-blur-md">
        <h1 className="text-lg font-semibold tracking-tight">
          <span className="text-white">Quote</span>{" "}
          <span className="text-blue-500">to Booking</span>
        </h1>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => openModal("login")}
            className="px-4 py-2 rounded-lg text-gray-300 hover:text-white transition"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => openModal("signup")}
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center overflow-hidden">

        <div className="absolute w-[600px] h-[600px] bg-blue-600 opacity-20 blur-3xl rounded-full"></div>

        <div className="mb-4 px-4 py-1 text-sm bg-white/10 text-gray-300 rounded-full">
          Built for service businesses
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight max-w-3xl">
          Close deals faster with{" "}
          <span className="text-blue-500">instant quotes & payments</span>
        </h1>

        <p className="text-gray-400 text-lg mb-8 max-w-xl">
          Send quotes, track approvals, and collect deposits — all in one seamless flow.
        </p>

        {/* 🔥 MOBILE FIX */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">

          <button
            type="button"
            onClick={() => openModal("signup")}
            className="bg-blue-600 px-6 py-3 rounded-lg text-lg hover:bg-blue-500 transition shadow-lg w-full sm:w-auto"
          >
            Get Started
          </button>

          <button
            type="button"
            onClick={() => openModal("login")}
            className="px-6 py-3 rounded-lg text-lg text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 transition w-full sm:w-auto"
          >
            Login
          </button>

        </div>

        <p className="text-sm text-gray-500 mt-6">
          No setup required • Works on mobile & desktop
        </p>
      </div>

      {/* HOW IT WORKS */}
      <div className="py-20 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-12">How it works</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-lg font-medium mb-2">Create Quote</h3>
            <p className="text-gray-400 text-sm">
              Generate quotes in seconds with all details.
            </p>
          </div>

          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-lg font-medium mb-2">Share Link</h3>
            <p className="text-gray-400 text-sm">
              Send a simple link to your customer.
            </p>
          </div>

          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-lg font-medium mb-2">Get Paid</h3>
            <p className="text-gray-400 text-sm">
              Customer accepts and pays instantly.
            </p>
          </div>
        </div>
      </div>

      {/* DASHBOARD PREVIEW */}
      <div className="py-20 px-6 flex justify-center">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-5xl w-full shadow-2xl">

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">

            <div className="p-4 bg-white/10 rounded-xl">
              <p className="text-sm text-gray-400">Total Quotes</p>
              <p className="text-2xl font-semibold">18</p>
            </div>

            <div className="p-4 bg-yellow-500/10 rounded-xl">
              <p className="text-sm text-yellow-400">Awaiting</p>
              <p className="text-2xl font-semibold">6</p>
            </div>

            <div className="p-4 bg-green-500/10 rounded-xl">
              <p className="text-sm text-green-400">Paid</p>
              <p className="text-2xl font-semibold">4</p>
            </div>

            <div className="p-4 bg-blue-600 rounded-xl">
              <p className="text-sm opacity-80">Revenue</p>
              <p className="text-2xl font-semibold">₹32,000</p>
            </div>

          </div>

          <div className="space-y-3 text-base">
            <div className="flex justify-between p-3 bg-white/5 rounded-lg">
              <span>Rahul</span>
              <span>₹5,000</span>
              <span className="text-yellow-400">Awaiting</span>
            </div>

            <div className="flex justify-between p-3 bg-white/5 rounded-lg">
              <span>Ankit</span>
              <span>₹8,000</span>
              <span className="text-blue-400">Approved</span>
            </div>

            <div className="flex justify-between p-3 bg-white/5 rounded-lg">
              <span>Sneha</span>
              <span>₹3,000</span>
              <span className="text-green-400">Paid</span>
            </div>
          </div>

        </div>
      </div>

      {/* FINAL CTA */}
      <div className="text-center py-20 px-6">
        <h2 className="text-3xl font-semibold mb-4">
          Ready to stop chasing clients?
        </h2>

        <button
          type="button"
          onClick={() => openModal("signup")}
          className="bg-blue-600 px-6 py-3 rounded-lg text-lg hover:bg-blue-500 transition"
        >
          Start Free
        </button>
      </div>

      {/* 🔥 MODAL FIX (VERY IMPORTANT) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <AuthModal
            initialMode={mode}
            onClose={() => setShowModal(false)}
          />
        </div>
      )}

    </div>
  )
}