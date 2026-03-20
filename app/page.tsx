"use client"

import { useState } from "react"
import AuthModal from "@/components/AuthModal"

export default function Home() {

  const [showModal, setShowModal] = useState(false)
  const [mode, setMode] = useState<"login" | "signup">("login")

  return (
    <div className="min-h-screen bg-white flex flex-col relative">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-white/80 backdrop-blur-md">
        <h1 className="text-lg font-semibold tracking-tight">
          <span className="text-gray-900">Quote</span>{" "}
          <span className="text-slate-700">to Booking</span>
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setMode("login")
              setShowModal(true)
            }}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Login
          </button>

          <button
            onClick={() => {
              setMode("signup")
              setShowModal(true)
            }}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-slate-800 transition"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* SCROLL STRIP */}
      <div className="overflow-hidden border-b bg-white py-3">
        <div className="animate-marquee flex gap-10 text-base font-medium text-gray-600">
          <span>🚀 Send Quotes Faster</span>
          <span>📩 Track Responses Easily</span>
          <span>💳 Collect Deposits Securely</span>
          <span>⏱️ Automated Follow-ups</span>
          <span>📊 Real-time Business Status</span>

          <span>🚀 Send Quotes Faster</span>
          <span>📩 Track Responses Easily</span>
          <span>💳 Collect Deposits Securely</span>
          <span>⏱️ Automated Follow-ups</span>
          <span>📊 Real-time Business Status</span>
        </div>
      </div>

      {/* HERO */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-slate-50 via-white to-slate-100 overflow-hidden">

        <div className="absolute top-20 w-[500px] h-[500px] bg-slate-300 opacity-20 blur-3xl rounded-full"></div>

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
            onClick={() => {
              setMode("signup")
              setShowModal(true)
            }}
            className="bg-slate-900 text-white px-6 py-3 rounded-lg text-lg shadow-sm hover:bg-slate-800 transition"
          >
            Get Started
          </button>

          <button
            onClick={() => {
              setMode("login")
              setShowModal(true)
            }}
            className="px-6 py-3 rounded-lg text-lg font-medium text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition shadow-sm"
          >
            Login
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-6">
          No setup required • Works on mobile & desktop
        </p>
      </div>

      {/* DASHBOARD PREVIEW */}
      <div className="relative py-16 px-6 bg-gradient-to-b from-white via-slate-50 to-slate-100 flex justify-center">

        <div className="absolute top-0 w-[600px] h-[600px] bg-slate-200 opacity-30 blur-3xl rounded-full"></div>

        <div className="bg-white border rounded-2xl shadow-2xl p-6 max-w-5xl w-full relative z-10">

          <div className="grid grid-cols-4 gap-4 mb-6">

            <div className="p-4 bg-gray-100 rounded-xl">
              <p className="text-sm text-gray-600 font-medium">Total Quotes</p>
              <p className="text-2xl font-semibold text-gray-900">18</p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-xl">
              <p className="text-sm text-yellow-600 font-medium">Awaiting</p>
              <p className="text-2xl font-semibold text-yellow-700">6</p>
            </div>

            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-green-600 font-medium">Paid</p>
              <p className="text-2xl font-semibold text-green-700">4</p>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl text-white shadow">
              <p className="text-sm opacity-70">Revenue</p>
              <p className="text-2xl font-semibold">₹32,000</p>
            </div>

          </div>

          <div className="space-y-3 text-base">
            <div className="flex justify-between p-3 bg-gray-50 border rounded-lg">
              <span className="font-medium text-gray-900">Rahul</span>
              <span className="font-semibold text-gray-900">₹5,000</span>
              <span className="text-yellow-600 font-medium">Awaiting</span>
            </div>

            <div className="flex justify-between p-3 bg-gray-50 border rounded-lg">
              <span className="font-medium text-gray-900">Ankit</span>
              <span className="font-semibold text-gray-900">₹8,000</span>
              <span className="text-blue-600 font-medium">Approved</span>
            </div>

            <div className="flex justify-between p-3 bg-gray-50 border rounded-lg">
              <span className="font-medium text-gray-900">Sneha</span>
              <span className="font-semibold text-gray-900">₹3,000</span>
              <span className="text-green-600 font-medium">Paid</span>
            </div>
          </div>

        </div>
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