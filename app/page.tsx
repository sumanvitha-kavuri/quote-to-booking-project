"use client"

import { useState } from "react"
import AuthModal from "@/components/AuthModal"

export default function Home() {

  const [showModal, setShowModal] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 flex flex-col">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-white/70 backdrop-blur-md">

        <h1 className="text-lg font-semibold tracking-tight">
          <span className="text-gray-900">Quote</span>{" "}
          <span className="text-slate-700">to Booking</span>
        </h1>

        <div className="flex items-center gap-4">

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
          >
            Login
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-slate-800 transition"
          >
            Get Started
          </button>

        </div>
      </div>

      {/* HERO */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">

        <div className="mb-4 px-4 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">
          Workflow Automation for Service Businesses
        </div>

        <h1 className="text-5xl md:text-6xl font-semibold mb-6 leading-tight text-gray-900">
          Turn Quotes into{" "}
          <span className="text-slate-700">Booked Jobs</span>
        </h1>

        <p className="text-gray-500 text-lg mb-8 max-w-xl">
          Send quotes, track responses, collect deposits, and stop chasing customers.
        </p>

        <div className="flex gap-4">

          <button
            onClick={() => setShowModal(true)}
            className="bg-slate-900 text-white px-6 py-3 rounded-lg text-lg shadow-sm hover:bg-slate-800 transition"
          >
            Get Started
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 rounded-lg text-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
          >
            Login
          </button>

        </div>

        <p className="text-sm text-gray-400 mt-6">
          No setup required • Works on mobile & desktop
        </p>

      </div>

      {/* DASHBOARD PREVIEW */}
      <div className="py-16 px-6 flex justify-center">

        <div className="bg-white border rounded-2xl shadow-xl p-6 max-w-5xl w-full">

          <div className="grid grid-cols-4 gap-4 mb-6">

            <div className="p-4 bg-gray-100 rounded-xl">
              <p className="text-sm text-gray-600">Total Quotes</p>
              <p className="text-2xl font-semibold text-gray-900">18</p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-xl">
              <p className="text-sm text-yellow-600">Awaiting</p>
              <p className="text-2xl font-semibold text-yellow-700">6</p>
            </div>

            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-green-600">Paid</p>
              <p className="text-2xl font-semibold text-green-700">4</p>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl text-white">
              <p className="text-sm opacity-70">Revenue</p>
              <p className="text-2xl font-semibold">₹32,000</p>
            </div>

          </div>

          <div className="space-y-3 text-base">

            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-900">Rahul</span>
              <span className="text-gray-900">₹5,000</span>
              <span className="text-yellow-600 font-medium">Awaiting</span>
            </div>

            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-900">Ankit</span>
              <span className="text-gray-900">₹8,000</span>
              <span className="text-blue-600 font-medium">Approved</span>
            </div>

            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-900">Sneha</span>
              <span className="text-gray-900">₹3,000</span>
              <span className="text-green-600 font-medium">Paid</span>
            </div>

          </div>

        </div>

      </div>

      {/* MODAL */}
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}

    </div>
  )
}