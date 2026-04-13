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
        if (q.status === "opened") newNotifications.push("Customer viewed the quote")
        if (q.status === "schedule_ready") newNotifications.push("Quote is ready to schedule")
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

  // ===== PIPELINE CALCULATIONS =====
  const totalPipeline = quotes.reduce((sum, q) => sum + (q.amount || 0), 0)

  const moneyWaiting = quotes
    .filter(q => q.status === "accepted" && q.payment_status !== "paid")
    .reduce((sum, q) => sum + (q.amount || 0), 0)

  const needsAction = quotes.filter(
    q =>
      q.status === "pending" ||
      q.status === "awaiting_response" ||
      q.status === "opened" ||
      q.status === "rejected"
  ).length

  const pendingQuotes = quotes.filter(
    q => q.status === "pending" || q.status === "awaiting_response"
  )

  const openedQuotes = quotes.filter(q => q.status === "opened")
  const acceptedQuotes = quotes.filter(q => q.status === "accepted")
  const paidQuotes = quotes.filter(q => q.status === "paid")
  const changeRequested = quotes.filter(q => q.status === "rejected")

  const unpaidAccepted = quotes.filter(
    q => q.status === "accepted" && q.payment_status !== "paid"
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Loading...
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-4 md:px-6 py-4 bg-white border-b shadow-sm">
        <h1 className="text-lg font-semibold">
          Quote <span className="text-blue-600">to Booking</span>
        </h1>

        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/")}>
            <Home className="w-5 h-5 text-gray-500 hover:text-gray-800" />
          </button>

          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)}>
              <Bell className="w-5 h-5 text-gray-500 hover:text-gray-800" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-64 bg-white border rounded-xl shadow-lg p-4 z-50">
                {notifications.length === 0
                  ? <p className="text-sm text-gray-500">No notifications</p>
                  : notifications.map((n, i) => (
                    <div key={i} className="text-sm p-2 hover:bg-gray-100 rounded">
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
            className="text-sm text-gray-500 hover:text-red-500"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h2 className="text-3xl font-semibold text-gray-900">
            Welcome, {profile?.name || user?.email?.split("@")[0]}
          </h2>

          <button
            onClick={() => router.push("/dashboard/quotes/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-sm"
          >
            + Create Quote
          </button>
        </div>

        {/* 🔥 PIPELINE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white p-5 rounded-2xl border shadow-sm">
            <p className="text-sm text-gray-500">Total Pipeline</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              ₹{totalPipeline.toLocaleString()}
            </h3>
            <p className="text-xs text-gray-400 mt-1">Estimated from all quotes</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border shadow-sm">
            <p className="text-sm text-gray-500">Money Waiting</p>
            <h3 className="text-2xl font-bold text-yellow-600 mt-1">
              ₹{moneyWaiting.toLocaleString()}
            </h3>
            <p className="text-xs text-gray-400 mt-1">Accepted but not paid</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border shadow-sm">
            <p className="text-sm text-gray-500">Needs Action</p>
            <h3 className="text-2xl font-bold text-red-500 mt-1">
              {needsAction} quotes
            </h3>
            <p className="text-xs text-gray-400 mt-1">Follow-ups required</p>
          </div>

        </div>

        {/* ACTION REQUIRED */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-5 shadow-sm">
          <h3 className="text-yellow-800 font-semibold mb-3">Action Required</h3>

          {pendingQuotes.length > 0 && <p>• {pendingQuotes.length} pending quotes</p>}
          {openedQuotes.length > 0 && <p>• {openedQuotes.length} opened but no response</p>}
          {changeRequested.length > 0 && <p>• {changeRequested.length} change requests</p>}
          {unpaidAccepted.length > 0 && <p>• {unpaidAccepted.length} unpaid accepted quotes</p>}
        </div>

        {/* (KEEP YOUR EXISTING KANBAN + RECENT ACTIVITY AS IS BELOW) */}

      </div>
    </main>
  )
}