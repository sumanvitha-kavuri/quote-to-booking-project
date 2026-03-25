"use client"

import { useState } from "react"
import AuthModal from "@/components/AuthModal"

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [mode, setMode] = useState<"login" | "signup">("login")

  const openModal = (type: "login" | "signup") => {
    setMode(type)
    setShowModal(true)
  }

  const formatCurrency = (amount: number, currency = "INR", locale = "en-IN") => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col relative">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-4 sm:px-8 py-4 border-b bg-white">
        <h1 className="text-lg font-semibold">
          <span>Quote</span>{" "}
          <span className="text-blue-600">Flow</span>
        </h1>

        <div className="flex gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => openModal("login")}
            className="px-3 py-2 text-gray-600 hover:text-black"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => openModal("signup")}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="flex flex-1 flex-col items-center justify-center text-center px-4 py-16">

        <h1 className="text-3xl sm:text-5xl font-bold mb-6 max-w-2xl">
          Turn quotes into{" "}
          <span className="text-blue-600">booked jobs</span>
        </h1>

        <p className="text-gray-600 mb-8 max-w-md">
          Send quotes, track approvals, and collect payments easily.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">

          <button
            type="button"
            onClick={() => openModal("signup")}
            className="bg-blue-600 px-6 py-3 text-white rounded-lg w-full sm:w-auto"
          >
            Get Started
          </button>

          <button
            type="button"
            onClick={() => openModal("login")}
            className="px-6 py-3 bg-white border rounded-lg w-full sm:w-auto"
          >
            Login
          </button>

        </div>
      </div>

      {/* DASHBOARD PREVIEW */}
      <div className="px-4 pb-16 max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-semibold">18</p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm">Pending</p>
              <p className="text-xl font-semibold">6</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm">Paid</p>
              <p className="text-xl font-semibold">4</p>
            </div>

            <div className="p-4 bg-blue-600 text-white rounded-lg">
              <p className="text-sm">Revenue</p>
              <p className="text-xl font-semibold">
                {formatCurrency(32000)}
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50">
          <AuthModal
            initialMode={mode}
            onClose={() => setShowModal(false)}
          />
        </div>
      )}

    </div>
  )
}