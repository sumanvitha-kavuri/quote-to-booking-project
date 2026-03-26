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
  const [prevQuotes, setPrevQuotes] = useState<any[]>([])

  const [notifications, setNotifications] = useState<string[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [seenNotifications, setSeenNotifications] = useState(false)

  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // 🔍 NEW SEARCH STATES
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])

  useEffect(() => {
    init()
  }, [])

  // 🔄 polling
  useEffect(() => {
    const interval = setInterval(() => {
      init()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // 🔔 notifications logic
  useEffect(() => {
    if (prevQuotes.length === 0) {
      setPrevQuotes(quotes)
      return
    }

    const newNotifications: string[] = []

    quotes.forEach((q) => {
      const old = prevQuotes.find(p => p.id === q.id)
      if (!old) return

      if (old.status !== q.status) {
        if (q.status === "accepted") newNotifications.push("Customer accepted a quote")
        if (q.status === "rejected") newNotifications.push("Customer rejected a quote")
        if (q.status === "paid") newNotifications.push("Payment received")
      }

      if (old.selected_option !== q.selected_option && q.selected_option) {
        newNotifications.push("Customer selected an option")
      }
    })

    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev])
      setSeenNotifications(false)
    }

    setPrevQuotes(quotes)
  }, [quotes])

  // 🔍 SEARCH DROPDOWN LOGIC
  useEffect(() => {
    const text = search.trim().toLowerCase()

    if (!text) {
      setSearchResults([])
      setShowSearchDropdown(false)
      return
    }

    const results = quotes.filter((q) =>
      (q.customer_name || "").toLowerCase().includes(text) ||
      (q.customer_email || "").toLowerCase().includes(text) ||
      (q.status || "").toLowerCase().includes(text) ||
      String(q.amount || "").includes(text)
    )

    setSearchResults(results.slice(0, 5))
    setShowSearchDropdown(true)

  }, [search, quotes])

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

  const total = quotes.length
  const pending = quotes.filter(q => q.status === "pending").length
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

          {/* 🔔 NOTIFICATIONS */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setSeenNotifications(true)
              }}
            >
              <Bell className="w-5 h-5 text-gray-300 hover:text-white" />

              {!seenNotifications && notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1.5 rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-72 bg-[#111827] border border-white/10 rounded-xl shadow-lg p-4 z-50">
                <h3 className="text-sm text-gray-300 mb-3">Notifications</h3>

                {notifications.length === 0 ? (
                  <p className="text-gray-400 text-sm">No new notifications</p>
                ) : (
                  notifications.map((n, i) => (
                    <div key={i} className="p-2 hover:bg-white/5 rounded">
                      🔔 {n}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => router.push("/dashboard/profile")}
            className="text-gray-300 hover:text-white text-sm"
          >
            Profile
          </button>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="text-gray-300 hover:text-red-400 text-sm"
          >
            Logout
          </button>

        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
<div className="flex justify-between items-center">
  <h2 className="text-3xl font-semibold">
    Welcome, {profile?.name || user?.email?.split("@")[0]}
  </h2>

  <div className="flex gap-3">

    {/* ✅ FIXED CREATE BUTTON */}
    <button
      onClick={() => router.push("/dashboard/quotes/new")}
      className="bg-blue-600 px-5 py-2.5 rounded-lg hover:bg-blue-500"
    >
      + Create Quote
    </button>

    {/* ✅ NEW BUTTON */}
    <button
      onClick={() => router.push("/dashboard/quotes")}
      className="bg-white/5 border border-white/10 px-5 py-2.5 rounded-lg hover:bg-white/10"
    >
      View All Quotes
    </button>

  </div>
</div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white/5 rounded-xl">
            <p>Total</p>
            <p>{total}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-xl">
            <p>Pending</p>
            <p>{pending}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-xl">
            <p>Accepted</p>
            <p>{accepted}</p>
          </div>

          <div className="p-4 bg-blue-600/20 rounded-xl">
            <p>Revenue</p>
            <p>₹{revenue}</p>
          </div>
        </div>

        {/* 🔍 SEARCH */}
        <div className="relative">

          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />

          <input
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* 🔽 DROPDOWN */}
          {showSearchDropdown && (
            <div className="absolute w-full mt-2 bg-[#111827] border border-white/10 rounded-xl shadow-lg z-50">

              {searchResults.length === 0 ? (
                <p className="p-3 text-sm text-gray-400">No results found</p>
              ) : (
                searchResults.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => {
                      setSearch("")
                      setShowSearchDropdown(false)

                      document
                        .getElementById(`quote-${q.id}`)
                        ?.scrollIntoView({ behavior: "smooth" })
                    }}
                    className="flex justify-between items-center p-3 hover:bg-white/5 cursor-pointer"
                  >
                    <div>
                      <p className="text-sm">{q.customer_name}</p>
                      <p className="text-xs text-gray-400">{q.customer_email}</p>
                    </div>

                    <span className="text-gray-400">→</span>
                  </div>
                ))
              )}

            </div>
          )}

        </div>

        {/* QUOTES */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h3 className="mb-4 text-gray-300">Recent Quotes</h3>

          {quotes.map((q) => (
            <div
              id={`quote-${q.id}`}
              key={q.id}
              className="flex justify-between p-4 border-b border-white/10"
            >
              <div>
                <p>{q.customer_name}</p>
                <p className="text-sm text-gray-400">{q.customer_email}</p>
              </div>

              <div className="flex gap-4 items-center">
                <span>₹{q.amount}</span>
                <span className={getStatusColor(q.status)}>
                  {q.status}
                </span>
              </div>
            </div>
          ))}

        </div>

      </div>

    </main>
  )
}