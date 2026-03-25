"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Home, Bell } from "lucide-react"

export default function Dashboard() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>({})
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

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

  // 🔥 FILTER + SEARCH LOGIC
  const filteredQuotes = quotes.filter(q => {
    const text = search.toLowerCase()

    const matchesSearch =
      q.customer_name?.toLowerCase().includes(text) ||
      q.customer_email?.toLowerCase().includes(text)

    const matchesFilter =
      filter === "all" ? true : q.status === filter

    return matchesSearch && matchesFilter
  })

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
      <div className="p-6 max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-semibold">Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">
            Welcome back, {profile?.name || user?.email}
          </p>
        </div>

        {/* 🔥 FILTERS */}
        <div className="flex gap-2 flex-wrap">

          {["all", "pending", "accepted", "paid"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                filter === f
                  ? "bg-blue-600 border-blue-500"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}

        </div>

        {/* 🔍 SEARCH WITH DROPDOWN */}
        <div className="relative">

          <input
            placeholder="Search by name or email..."
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <div className="absolute w-full mt-2 bg-[#111827] border border-white/10 rounded-lg max-h-60 overflow-y-auto z-10">

              {filteredQuotes.length === 0 ? (
                <div className="p-3 text-gray-400 text-sm">
                  No results found
                </div>
              ) : (
                filteredQuotes.slice(0, 5).map((q) => (
                  <div
                    key={q.id}
                    onClick={() => {
                      setSearch("")
                      router.push(`/dashboard/quotes/${q.id}`)
                    }}
                    className="p-3 hover:bg-white/10 cursor-pointer"
                  >
                    <p className="text-sm">{q.customer_name}</p>
                    <p className="text-xs text-gray-400">
                      {q.customer_email}
                    </p>
                  </div>
                ))
              )}

            </div>
          )}

        </div>

        {/* QUOTES LIST */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

          <h3 className="mb-4 text-gray-300">Quotes</h3>

          {filteredQuotes.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No quotes available
            </div>
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

                  <div className="flex items-center gap-4">

                    <p>₹{q.amount}</p>

                    <span className={getStatusColor(q.status)}>
                      {q.status}
                    </span>

                    {/* VIEW BUTTON */}
                    <button
                      onClick={() => router.push(`/dashboard/quotes/${q.id}`)}
                      className="px-3 py-1 text-sm bg-blue-600 rounded-md hover:bg-blue-500"
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