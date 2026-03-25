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
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setUser(user)

    const { data } = await supabase
      .from("quotes")
      .select("*")
      .eq("user_id", user.id)

    setQuotes(data || [])
    setLoading(false)
  }

  const totalQuotes = quotes.length
  const awaiting = quotes.filter(q => q.status === "awaiting").length
  const paid = quotes.filter(q => q.status === "paid").length
  const revenue = quotes
    .filter(q => q.status === "paid")
    .reduce((sum, q) => sum + (q.amount || 0), 0)

  if (loading) return <div className="p-10 text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-6">

      <div className="max-w-5xl mx-auto">

        {/* 🔥 HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">

          {/* 👋 WELCOME */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">
              Welcome, {user?.email?.split("@")[0]}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Here’s what’s happening with your quotes
            </p>
          </div>

          {/* ➕ CREATE QUOTE */}
          <button
            onClick={() => router.push("/create-quote")}
            className="bg-blue-600 px-5 py-2.5 rounded-lg hover:bg-blue-500 transition text-sm font-medium"
          >
            + Create Quote
          </button>

        </div>

        {/* 🔥 STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">

          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-sm text-gray-400">Total Quotes</p>
            <p className="text-2xl font-semibold">{totalQuotes}</p>
          </div>

          <div className="p-4 bg-yellow-500/10 rounded-xl">
            <p className="text-sm text-yellow-400">Awaiting</p>
            <p className="text-2xl font-semibold">{awaiting}</p>
          </div>

          <div className="p-4 bg-green-500/10 rounded-xl">
            <p className="text-sm text-green-400">Paid</p>
            <p className="text-2xl font-semibold">{paid}</p>
          </div>

          <div className="p-4 bg-blue-600 rounded-xl">
            <p className="text-sm opacity-80">Revenue</p>
            <p className="text-2xl font-semibold">₹{revenue}</p>
          </div>

        </div>

        {/* 🔥 QUOTES LIST */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

          <h2 className="font-medium mb-4">Recent Quotes</h2>

          {quotes.length === 0 ? (
            <p className="text-gray-400 text-sm text-center">
              No quotes yet. Create your first one 🚀
            </p>
          ) : (
            <div className="space-y-3">

              {quotes.map((q, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                >
                  <span>{q.client_name || "Client"}</span>
                  <span>₹{q.amount || 0}</span>

                  <span
                    className={`text-sm ${
                      q.status === "paid"
                        ? "text-green-400"
                        : q.status === "awaiting"
                        ? "text-yellow-400"
                        : "text-blue-400"
                    }`}
                  >
                    {q.status}
                  </span>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>

    </div>
  )
}