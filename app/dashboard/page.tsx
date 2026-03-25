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
    if (status === "paid") return "text-green-400"
    if (status === "accepted") return "text-blue-400"
    return "text-yellow-400"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 bg-[#0B0F19]">
        Loading...
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0B0F19] text-white">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-4 sm:px-8 py-5 border-b border-white/10 backdrop-blur-md">

        <h1 className="text-lg font-semibold tracking-tight">
          <span className="text-white">Quote</span>{" "}
          <span className="text-blue-500">to Booking</span>
        </h1>

        <div className="flex items-center gap-4">

          <a href="/dashboard/profile" className="text-gray-300 hover:text-white">
            Profile
          </a>

          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.replace("/login")
            }}
            className="text-gray-300 hover:text-red-400"
          >
            Logout
          </button>

        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

          <div>
            <h2 className="text-3xl font-semibold">
              Dashboard
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Welcome back, {user?.email}
            </p>
          </div>

          <a
            href="/dashboard/quotes/new"
            className="bg-blue-600 px-5 py-2.5 rounded-lg hover:bg-blue-500 transition"
          >
            + Create Quote
          </a>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-sm text-gray-400">Total</p>
            <p className="text-2xl font-semibold">{total}</p>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-sm text-gray-400">Pending</p>
            <p className="text-2xl font-semibold">{pending}</p>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-sm text-gray-400">Accepted</p>
            <p className="text-2xl font-semibold">{accepted}</p>
          </div>

          <div className="p-4 bg-blue-600/20 border border-blue-500/20 rounded-xl">
            <p className="text-sm text-blue-400">Revenue</p>
            <p className="text-2xl font-semibold text-blue-400">
              ₹{revenue}
            </p>
          </div>

        </div>

        {/* QUOTES */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

          <h3 className="mb-4 font-medium text-gray-300">
            Recent Quotes
          </h3>

          {quotes.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              No quotes yet — create your first one 🚀
            </div>
          ) : (
            <div className="space-y-3">

              {quotes.map((q) => (
                <div
                  key={q.id}
                  className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition"
                >
                  <div>
                    <p className="font-medium">{q.customer_name}</p>
                    <p className="text-sm text-gray-400">
                      {q.customer_email}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">

                    <p className="font-semibold">₹{q.amount}</p>

                    <span className={`text-sm font-medium ${getStatusColor(q.status)}`}>
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