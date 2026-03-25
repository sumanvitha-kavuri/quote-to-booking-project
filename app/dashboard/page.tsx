"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    init()
  }, [])

  async function init() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.replace("/login")
      return
    }

    setUser(user)

    const { data } = await supabase
      .from("quotes")
      .select("*")
      .eq("user_id", user.id)

    setQuotes(data || [])
    setLoading(false)
  }

  const total = quotes.length
  const pending = quotes.filter(q => q.status === "pending").length
  const accepted = quotes.filter(q => q.status === "accepted").length
  const paid = quotes.filter(q => q.status === "paid").length

  const revenue = quotes
    .filter(q => q.status === "paid")
    .reduce((sum, q) => sum + (q.amount || 0), 0)

  function getStatusColor(status: string) {
    if (status === "paid") return "bg-green-500/10 text-green-400 border-green-500/20"
    if (status === "accepted") return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading dashboard...
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 backdrop-blur">

        <h1 className="text-lg font-semibold tracking-tight">
          Quote <span className="text-gray-400">to Booking</span>
        </h1>

        <div className="flex items-center gap-6 text-sm">

          <button className="text-gray-400 hover:text-white transition">
            Notifications
          </button>

          <a href="/dashboard/profile" className="text-gray-400 hover:text-white transition">
            Profile
          </a>

          <button
            className="text-gray-400 hover:text-red-400 transition"
            onClick={async () => {
              await supabase.auth.signOut()
              router.replace("/login")
            }}
          >
            Logout
          </button>

        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Dashboard
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back, {user?.email}
            </p>
          </div>

          <a
            href="/dashboard/quotes/new"
            className="bg-white text-black px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition shadow"
          >
            + Create Quote
          </a>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          <div className="bg-[#151515] p-5 rounded-2xl border border-white/5">
            <p className="text-gray-400 text-sm">Total Quotes</p>
            <p className="text-3xl font-semibold mt-1">{total}</p>
          </div>

          <div className="bg-[#151515] p-5 rounded-2xl border border-white/5">
            <p className="text-gray-400 text-sm">Pending</p>
            <p className="text-3xl font-semibold mt-1">{pending}</p>
          </div>

          <div className="bg-[#151515] p-5 rounded-2xl border border-white/5">
            <p className="text-gray-400 text-sm">Accepted</p>
            <p className="text-3xl font-semibold mt-1">{accepted}</p>
          </div>

          {/* 💰 Highlighted */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 p-5 rounded-2xl border border-green-500/20">
            <p className="text-green-400 text-sm">Revenue</p>
            <p className="text-3xl font-semibold mt-1 text-green-400">
              ₹{revenue}
            </p>
          </div>

        </div>

        {/* QUOTES */}
        <div className="bg-[#151515] rounded-2xl p-5 border border-white/5">

          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-300">
              Recent Quotes
            </h3>
          </div>

          {quotes.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              No quotes yet — create your first one 🚀
            </div>
          ) : (
            <div className="space-y-3">

              {quotes.map((q) => (
                <div
                  key={q.id}
                  className="flex justify-between items-center p-4 bg-[#0f0f0f] rounded-xl border border-white/5 hover:border-white/10 transition"
                >
                  <div>
                    <p className="font-medium">{q.customer_name}</p>
                    <p className="text-sm text-gray-500">
                      {q.customer_email}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">

                    <p className="font-semibold">₹{q.amount}</p>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(q.status)}`}
                    >
                      {q.status}
                    </span>

                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>

    </main>
  )
}