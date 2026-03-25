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
  const [filter, setFilter] = useState("all")
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const [showNotifications, setShowNotifications] = useState(false)
  const [seenNotifications, setSeenNotifications] = useState(false)

  useEffect(() => {
    init()
  }, [])

  // 🔄 AUTO REFRESH (detect customer actions)
  useEffect(() => {
    const interval = setInterval(() => {
      init()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // 🔔 CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    function handleClickOutside(e: any) {
      if (!e.target.closest(".notif-wrapper")) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
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

          {/* 🔔 NOTIFICATIONS */}
          <div className="relative notif-wrapper">

            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setSeenNotifications(true) // ✅ mark as seen
              }}
            >
              <Bell className="w-5 h-5 text-gray-300 hover:text-white" />

              {!seenNotifications && (pending + unpaidQuotes.length) > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1.5 rounded-full">
                  {pending + unpaidQuotes.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-72 bg-[#111827] border border-white/10 rounded-xl shadow-lg p-4 z-50">

                <h3 className="text-sm text-gray-300 mb-3">Notifications</h3>

                {pending === 0 && unpaidQuotes.length === 0 ? (
                  <p className="text-gray-400 text-sm">No new notifications</p>
                ) : (
                  <div className="space-y-2 text-sm">

                    {pending > 0 && (
                      <div
                        onClick={() => {
                          setSearch("pending")
                          setShowNotifications(false)
                        }}
                        className="p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                      >
                        🔔 {pending} pending {pending === 1 ? "quote" : "quotes"}
                      </div>
                    )}

                    {unpaidQuotes.length > 0 && (
                      <div
                        onClick={() => {
                          setSearch("accepted")
                          setShowNotifications(false)
                        }}
                        className="p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                      >
                        💰 {unpaidQuotes.length} unpaid accepted quotes
                      </div>
                    )}

                  </div>
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

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

          <div>
            <h2 className="text-3xl font-semibold">
              Welcome, {profile?.name || user?.email?.split("@")[0]}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Here’s what’s happening with your quotes
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard/create")}
            className="bg-blue-600 px-5 py-2.5 rounded-lg hover:bg-blue-500 transition text-sm font-medium"
          >
            + Create Quote
          </button>

        </div>

        {/* (rest of your UI unchanged) */}
      </div>

      {/* LOGOUT MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 w-[300px] text-center">
            <h3 className="text-lg font-medium mb-2">
              Confirm Logout
            </h3>
            <p className="text-sm text-gray-400 mb-5">
              Are you sure you want to logout?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.replace("/")
                }}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}