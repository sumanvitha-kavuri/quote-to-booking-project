"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Home, Bell, Search } from "lucide-react"

export default function Dashboard() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>({})
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

    const { data: profileData } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()

    setProfile(profileData || {})

    const { data } = await supabase
      .from("quotes")
      .select("*")
      .eq("user_id", user.id)

    setQuotes(data || [])
    setLoading(false)
  }

  // 🔥 UPDATED SEARCH + FILTER
  const filteredQuotes = quotes.filter(q => {
    const text = search.toLowerCase()

    const matchesSearch =
      q.customer_name?.toLowerCase().includes(text) ||
      q.customer_email?.toLowerCase().includes(text) ||
      q.status?.toLowerCase().includes(text)

    const matchesFilter =
      filter === "all" ? true : q.status === filter

    return matchesSearch && matchesFilter
  })

  const pendingQuotes = quotes.filter(q => q.status === "pending")
  const unpaidQuotes = quotes.filter(q => q.status === "accepted")

  const total = quotes.length
  const pending = pendingQuotes.length
  const accepted = quotes.filter(q => q.status === "accepted").length

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
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] text-gray-400">
        Loading...
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0B0F19] text-white">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">

        <h1 className="text-lg font-semibold">
          Quote <span className="text-blue-500">to Booking</span>
        </h1>

        <div className="flex items-center gap-5">

          <button onClick={() => router.push("/")}>
            <Home className="w-5 h-5 text-gray-300 hover:text-white" />
          </button>

          <button onClick={() => alert("Notifications coming soon")}>
            <Bell className="w-5 h-5 text-gray-300 hover:text-white" />
          </button>

          <button
            onClick={() => router.push("/dashboard/profile")}
            className="text-gray-300 hover:text-white text-sm"
          >
            Profile
          </button>

          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.replace("/login")
            }}
            className="text-gray-300 hover:text-red-400 text-sm"
          >
            Logout
          </button>

        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-semibold">Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">
            Welcome back, {profile?.name || user?.email}
          </p>
        </div>

        {/* ACTION REQUIRED */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
          <h3 className="text-yellow-400 font-medium mb-3">
            Action Required
          </h3>

          <div className="space-y-2 text-sm">

            {pending > 0 && (
              <div onClick={() => setSearch("pending")} className="cursor-pointer">
                • {pending} {pending === 1 ? "quote is" : "quotes are"} pending
              </div>
            )}

            {unpaidQuotes.length > 0 && (
              <div onClick={() => setSearch("accepted")} className="cursor-pointer">
                • {unpaidQuotes.length} accepted but not paid
              </div>
            )}

          </div>
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

        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />

          <input
            placeholder="Search by name, email, or status..."
            className="w-full pl-9 pr-10 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* QUOTES */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

          <h3 className="mb-4 text-gray-300">Recent Quotes</h3>

          {/* ✅ FILTER BUTTONS */}
          <div className="flex gap-2 mb-4">
            {["all", "pending", "accepted", "paid"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs rounded-full border ${
                  filter === f
                    ? "bg-blue-600 border-blue-500"
                    : "bg-white/5 border-white/10"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {filteredQuotes.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No matching quotes found
            </p>
          ) : (
            <div className="space-y-3">

              {filteredQuotes.map((q) => (
                <div
                  key={q.id}
                  className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div>
                    <p className="font-medium">{q.customer_name}</p>
                    <p className="text-sm text-gray-400">{q.customer_email}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <p>₹{q.amount}</p>

                    <span className={getStatusColor(q.status)}>
                      {q.status}
                    </span>

                    {/* ✅ VIEW BUTTON */}
                 <button
  onClick={() => router.push(`/dashboard/quotes/${q.id}`)}
  className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-500 rounded-lg transition"
>
  View
</button>

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