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
  const [prevQuotes, setPrevQuotes] = useState<any[]>([])

  const [notifications, setNotifications] = useState<string[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  const [loading, setLoading] = useState(true)

  const [focus, setFocus] = useState<"pending" | "accepted" | "paid" | null>(null)

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      init()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

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
        if (q.status === "rejected") newNotifications.push("Customer requested changes")
        if (q.status === "paid") newNotifications.push("Payment received")
      }
    })

    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev])
    }

    setPrevQuotes(quotes)
  }, [quotes])

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

  function handleFocus(section: "pending" | "accepted" | "paid") {
    setFocus(section)
    document.getElementById(section)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  }

  const pendingQuotes = quotes.filter(q => q.status === "pending")
  const acceptedQuotes = quotes.filter(q => q.status === "accepted")
  const paidQuotes = quotes.filter(q => q.status === "paid")
  const changeRequested = quotes.filter(q => q.status === "rejected")
  const unpaidAccepted = quotes.filter(q => q.status === "accepted" && q.payment_status !== "paid")

  const openedQuotes = quotes.filter(q => q.status === "opened")

  const scheduleReadyQuotes = quotes.filter(
    q => q.status === "paid" && q.payment_status === "paid"
  )

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
      <div className="flex justify-between items-center px-4 md:px-6 py-5 border-b border-white/10">
        <h1 className="text-lg font-semibold">
          Quote <span className="text-blue-500">to Booking</span>
        </h1>

        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/")}>
            <Home className="w-5 h-5 text-gray-300 hover:text-white" />
          </button>

          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)}>
              <Bell className="w-5 h-5 text-gray-300 hover:text-white" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-64 bg-[#111827] rounded-xl p-4 z-50">
                {notifications.length === 0
                  ? <p className="text-sm text-gray-400">No notifications</p>
                  : notifications.map((n, i) => (
                    <div key={i} className="text-sm p-2 hover:bg-white/5 rounded">
                      🔔 {n}
                    </div>
                  ))
                }
              </div>
            )}
          </div>

          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.replace("/")
            }}
            className="text-sm text-gray-300 hover:text-red-400"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Welcome, {profile?.name || user?.email?.split("@")[0]}
          </h2>

          <button
            onClick={() => router.push("/dashboard/quotes/new")}
            className="bg-blue-600 px-4 py-2 rounded-lg"
          >
            + Create Quote
          </button>
        </div>

        {/* ACTION REQUIRED */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
          <h3 className="text-yellow-400 mb-2">Action Required</h3>

          {pendingQuotes.length > 0 && (
            <p className="cursor-pointer" onClick={() => handleFocus("pending")}>
              • {pendingQuotes.length} pending quotes
            </p>
          )}

          {openedQuotes.length > 0 && (
            <p>• {openedQuotes.length} opened but no response</p>
          )}

          {changeRequested.length > 0 && (
            <p className="cursor-pointer" onClick={() => handleFocus("pending")}>
              • {changeRequested.length} change requests
            </p>
          )}

          {unpaidAccepted.length > 0 && (
            <p className="cursor-pointer" onClick={() => handleFocus("accepted")}>
              • {unpaidAccepted.length} unpaid accepted quotes
            </p>
          )}
        </div>

        {/* EMPTY STATE */}
        {quotes.length === 0 && (
          <div className="bg-white/5 p-6 rounded-xl text-center">
            <p className="text-gray-400 mb-3">No quotes yet</p>
            <button
              onClick={() => router.push("/dashboard/quotes/new")}
              className="bg-blue-600 px-4 py-2 rounded"
            >
              Create your first quote
            </button>
          </div>
        )}

        {/* PIPELINE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Pending */}
          <div id="pending" className={`rounded-xl p-4 ${focus === "pending" ? "bg-yellow-500/20 border border-yellow-400" : "bg-white/5"}`}>
            <h3 className="text-yellow-400 mb-3">Pending</h3>
            {pendingQuotes.map(q => (
              <div key={q.id} onClick={() => router.push(`/dashboard/quotes/${q.id}`)} className="p-3 border-b border-white/10 cursor-pointer hover:bg-white/5 rounded">
                <p>{q.customer_name}</p>
                <p className="text-xs text-gray-400">₹{q.amount}</p>
              </div>
            ))}
          </div>

          {/* Accepted */}
          <div id="accepted" className={`rounded-xl p-4 ${focus === "accepted" ? "bg-blue-500/20 border border-blue-400" : "bg-white/5"}`}>
            <h3 className="text-blue-400 mb-3">Accepted</h3>
            {acceptedQuotes.map(q => (
              <div key={q.id} onClick={() => router.push(`/dashboard/quotes/${q.id}`)} className="p-3 border-b border-white/10 cursor-pointer hover:bg-white/5 rounded">
                <p>{q.customer_name}</p>
                <p className="text-xs text-gray-400">₹{q.amount}</p>
              </div>
            ))}
          </div>

          {/* Paid */}
          <div id="paid" className={`rounded-xl p-4 ${focus === "paid" ? "bg-green-500/20 border border-green-400" : "bg-white/5"}`}>
            <h3 className="text-green-400 mb-3">Paid</h3>
            {paidQuotes.map(q => (
              <div key={q.id} onClick={() => router.push(`/dashboard/quotes/${q.id}`)} className="p-3 border-b border-white/10 cursor-pointer hover:bg-white/5 rounded">
                <p>{q.customer_name}</p>
                <p className="text-xs text-gray-400">₹{q.amount}</p>
              </div>
            ))}
          </div>

          {/* Ready */}
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="text-purple-400 mb-3">Ready</h3>
            {scheduleReadyQuotes.map(q => (
              <div key={q.id} className="p-3 border-b border-white/10">
                <p>{q.customer_name}</p>
                <p className="text-xs text-gray-400">Ready to schedule</p>
              </div>
            ))}
          </div>

        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="mb-3">Recent Activity</h3>
          {notifications.slice(0, 5).map((n, i) => (
            <div key={i} className="p-2 border-b border-white/10 text-sm">
              {n}
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}