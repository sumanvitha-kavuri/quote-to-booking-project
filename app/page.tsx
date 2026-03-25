"use client"

import { useState } from "react"
import AuthModal from "@/components/AuthModal"

export default function Home() {

  const [showModal, setShowModal] = useState(false)
  const [mode, setMode] = useState<"login" | "signup">("login")

  // ✅ currency formatter (scalable)
  const formatCurrency = (amount: number, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col relative">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 sm:px-8 py-4 sm:py-5 border-b bg-white">
        <h1 className="text-lg font-semibold tracking-tight">
          <span className="text-gray-900">Quote</span>{" "}
          <span className="text-blue-600">Flow</span>
        </h1>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => {
              setMode("login")
              setShowModal(true)
            }}
            className="px-3 sm:px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 transition"
          >
            Login
          </button>

          <button
            onClick={() => {
              setMode("signup")
              setShowModal(true)
            }}
            className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-500 transition shadow-sm"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center overflow-hidden py-20 sm:py-24">

        <div className="absolute w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-blue-100 blur-3xl rounded-full opacity-40"></div>

        <div className="mb-4 px-4 py-1 text-sm bg-blue-50 text-blue-600 rounded-full">
          Built for service businesses
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight max-w-3xl">
          Turn quotes into{" "}
          <span className="text-blue-600">booked jobs</span>
        </h1>

        <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-xl">
          Send quotes, track approvals, and collect deposits — all in one simple workflow.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={() => {
              setMode("signup")
              setShowModal(true)
            }}
            className="bg-blue-600 px-6 py-3 rounded-lg text-lg text-white hover:bg-blue-500 transition shadow-md"
          >
            Get Started
          </button>

          <button
            onClick={() => {
              setMode("login")
              setShowModal(true)
            }}
            className="px-6 py-3 rounded-lg text-lg text-gray-700 bg-white border hover:bg-gray-100 transition"
          >
            Login
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-6">
          No setup required • Works on mobile & desktop
        </p>
      </div>

      {/* HOW IT WORKS */}
      <div className="py-16 sm:py-20 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-10 sm:mb-12">
          How it works
        </h2>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">

          <div className="p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-4">
              🚀
            </div>
            <h3 className="text-lg font-medium mb-2">Create Quote</h3>
            <p className="text-gray-500 text-sm">
              Generate quotes in seconds with all details.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 mb-4">
              🔗
            </div>
            <h3 className="text-lg font-medium mb-2">Share Link</h3>
            <p className="text-gray-500 text-sm">
              Send a simple link to your customer.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-100 text-green-600 mb-4">
              💳
            </div>
            <h3 className="text-lg font-medium mb-2">Get Paid</h3>
            <p className="text-gray-500 text-sm">
              Customer accepts and pays instantly.
            </p>
          </div>

        </div>
      </div>

      {/* DASHBOARD PREVIEW */}
      <div className="py-16 sm:py-20 px-6 flex justify-center">
        <div className="bg-white border rounded-2xl p-4 sm:p-6 max-w-5xl w-full shadow-xl">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

            <div className="p-4 bg-gray-50 rounded-xl border">
              <p className="text-sm text-gray-500">Total Quotes</p>
              <p className="text-xl sm:text-2xl font-semibold">18</p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-xl border">
              <p className="text-sm text-yellow-600">Awaiting</p>
              <p className="text-xl sm:text-2xl font-semibold text-yellow-700">6</p>
            </div>

            <div className="p-4 bg-green-50 rounded-xl border">
              <p className="text-sm text-green-600">Paid</p>
              <p className="text-xl sm:text-2xl font-semibold text-green-700">4</p>
            </div>

            <div className="p-4 bg-blue-600 rounded-xl text-white">
              <p className="text-sm opacity-80">Revenue</p>
              <p className="text-xl sm:text-2xl font-semibold">
                {formatCurrency(32000)}
              </p>
            </div>

          </div>

          <div className="space-y-3 text-sm sm:text-base">

            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-3 bg-gray-50 rounded-lg border">
              <span>Rahul</span>
              <span>{formatCurrency(5000)}</span>
              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 w-fit">
                Awaiting
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-3 bg-gray-50 rounded-lg border">
              <span>Ankit</span>
              <span>{formatCurrency(8000)}</span>
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 w-fit">
                Approved
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-3 bg-gray-50 rounded-lg border">
              <span>Sneha</span>
              <span>{formatCurrency(3000)}</span>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 w-fit">
                Paid
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* FINAL CTA */}
      <div className="text-center py-16 sm:py-20 px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
          Ready to stop chasing clients?
        </h2>

        <button
          onClick={() => {
            setMode("signup")
            setShowModal(true)
          }}
          className="bg-blue-600 px-6 py-3 rounded-lg text-lg text-white hover:bg-blue-500 transition shadow-md"
        >
          Start Free
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <AuthModal
          initialMode={mode}
          onClose={() => setShowModal(false)}
        />
      )}

    </div>
  )
}