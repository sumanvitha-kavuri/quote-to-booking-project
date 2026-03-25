"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all") // ✅ ADDED

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

  // 🔥 FIXED SEARCH + FILTER LOGIC
  const filteredQuotes = quotes.filter((q) => {
    const text = search.toLowerCase()

    const matchesSearch =
      q.customer_name?.toLowerCase().includes(text) ||
      q.customer_email?.toLowerCase().includes(text) ||
      q.status?.toLowerCase().includes(text)

    const matchesFilter =
      filter === "all" ? true : q.status === filter

    return matchesSearch && matchesFilter
  })

  // 🔥 CALCULATIONS (unchanged)
  const total = quotes.length
  const pending = quotes.filter(q => q.status === "pending").length
  const accepted = quotes.filter(q => q.status === "accepted").length
  const paid = quotes.filter(q => q.status === "paid").length

  const revenue = quotes
    .filter(q => q.status === "paid")
    .reduce((sum, q) => sum + (q.amount || 0), 0)

  function getStatusColor(status: string) {
    if (status === "paid") return "bg-green-500/10 text-green-400"
    if (status === "accepted") return "bg-blue-500/10 text-blue-400"
    return "bg-yellow-500/10 text-yellow-400"
  }

  if (loading) {
    return <div className="p-10 text-white">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">

        <h1 className="text-lg font-semibold">
          Quote<span className="text-gray-400"> to Booking</span>
        </h1>

        <div className="flex items-center gap-6 text-sm">

          <button className="text-gray-400 hover:text-white">
            Notifications
          </button>

          <a href="/dashboard/profile" className="text-gray-400 hover:text-white">
            Profile
          </a>

          <button
            className="text-gray-400 hover:text-white"
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
      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <p className="text-gray-500 text-sm">
              Welcome back, {user?.email}
            </p>
          </div>

          <a
            href="/dashboard/quotes/new"
            className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:opacity-90"
          >
            + Create Quote
          </a>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-[#1a1a1a] p-4 rounded-xl">
            <p className="text-gray-400 text-sm">Total</p>
            <p className="text-2xl font-semibold">{total}</p>
          </div>

          <div className="bg-[#1a1a1a] p-4 rounded-xl">
            <p className="text-gray-400 text-sm">Pending</p>
            <p className="text-2xl font-semibold">{pending}</p>
          </div>

          <div className="bg-[#1a1a1a] p-4 rounded-xl">
            <p className="text-gray-400 text-sm">Accepted</p>
            <p className="text-2xl font-semibold">{accepted}</p>
          </div>

          <div className="bg-[#1a1a1a] p-4 rounded-xl">
            <p className="text-gray-400 text-sm">Revenue</p>
            <p className="text-2xl font-semibold">₹{revenue}</p>
          </div>

        </div>

        {/* SEARCH */}
        <input
          placeholder="Search..."
          className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-white/10 text-white outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* QUOTES LIST */}
        <div className="bg-[#1a1a1a] rounded-xl p-4">

          <h3 className="mb-2 font-medium text-gray-300">
            Recent Quotes
          </h3>

          {/* ✅ FILTER BUTTONS */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {["all", "pending", "accepted", "paid"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs border ${
                  filter === f
                    ? "bg-blue-600 border-blue-500"
                    : "bg-white/5 border-white/10"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* EMPTY STATE */}
          {filteredQuotes.length === 0 && (
            <p className="text-gray-500 text-sm">
              {search || filter !== "all"
                ? "No matching quotes found"
                : "No quotes yet"}
            </p>
          )}

          <div className="space-y-3">

            {filteredQuotes.map((q) => (
              <div
                key={q.id}
                className="flex justify-between items-center p-3 bg-[#111] rounded-lg border border-white/5"
              >
                <div>
                  <p className="font-medium">{q.customer_name}</p>
                  <p className="text-sm text-gray-500">{q.customer_email}</p>
                </div>

                <div className="flex items-center gap-6">

                  <p className="font-medium">₹{q.amount}</p>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(q.status)}`}
                  >
                    {q.status}
                  </span>

                </div>
              </div>
            ))}

          </div>

        </div>

      </div>

    </main>
  )
}