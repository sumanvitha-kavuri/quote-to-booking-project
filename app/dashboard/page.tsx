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

  const pendingQuotes = quotes.filter(
    q => q.status === "pending" || q.status === "awaiting_response"
  )

  const openedQuotes = quotes.filter(q => q.status === "opened")
  const changeRequested = quotes.filter(q => q.status === "rejected")

  const unpaidAccepted = quotes.filter(
    q => q.status === "accepted" && q.payment_status !== "paid"
  )

  const totalPipelineValue = quotes.reduce((sum, q) => sum + (q.amount || 0), 0)

  const moneyWaiting = quotes
    .filter(q => q.status === "accepted" && q.payment_status !== "paid")
    .reduce((sum, q) => sum + (q.amount || 0), 0)

  const needsActionCount =
    pendingQuotes.length +
    openedQuotes.length +
    changeRequested.length +
    unpaidAccepted.length

  function getUrgency(q: any) {
    const last = new Date(q.updated_at || q.created_at).getTime()
    const diff = (Date.now() - last) / (1000 * 60 * 60)
    if (diff > 48) return "high"
    if (diff > 24) return "medium"
    return "low"
  }

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  function getSmartMessage(q: any) {
    const last = new Date(q.updated_at || q.created_at).getTime()
    const days = Math.floor((Date.now() - last) / (1000 * 60 * 60 * 24))

    if (q.status === "pending" || q.status === "opened") {
      if (days >= 2) return `Follow-up overdue by ${days}d`
      if (days >= 1) return `Follow up today`
      return "Recently contacted"
    }

    if (q.status === "accepted" && q.payment_status !== "paid") {
      if (days >= 2) return `Payment overdue by ${days}d`
      return "Waiting for payment"
    }

    if (q.status === "paid") return "Ready to schedule"
    if (q.status === "schedule_ready") return "Confirm schedule"

    return "No action"
  }

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
              {profile?.name?.[0] || "U"}
            </div>
            <div>
              <p className="text-sm font-semibold">{profile?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="px-3 py-2 hover:bg-gray-100 rounded">📊 Dashboard</div>
            <div className="px-3 py-2 hover:bg-gray-100 rounded">📁 All Quotes</div>
            <div className="px-3 py-2 hover:bg-gray-100 rounded">⚠️ Needs Action</div>
            <div className="px-3 py-2 hover:bg-gray-100 rounded">📉 Lost Quotes</div>
            <div className="px-3 py-2 hover:bg-gray-100 rounded">🔔 Activity</div>
          </div>
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

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">

          <h2 className="text-3xl font-semibold">
            Welcome, {profile?.name || user?.email?.split("@")[0]}
          </h2>

          {/* METRICS */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl shadow">
              ₹{totalPipelineValue.toLocaleString()}
            </div>
            <div className="bg-white p-5 rounded-xl shadow">
              ₹{moneyWaiting.toLocaleString()}
            </div>
            <div className="bg-white p-5 rounded-xl shadow">
              {needsActionCount}
            </div>
          </div>

          {/* KANBAN */}
          <div className="flex gap-5 overflow-x-auto">
            {["pending", "opened", "accepted", "paid"].map((status) => {
              const list = quotes.filter(q => q.status === status)

              return (
                <div key={status} className="w-72 bg-white p-4 rounded-xl shadow">
                  <h3 className="mb-4 font-semibold capitalize">{status}</h3>

                  {list.map(q => {
                    const urgency = getUrgency(q)

                    return (
                      <div key={q.id} className="border p-3 mb-3 rounded-lg">
                        <p>{q.customer_name}</p>
                        <p className="text-xs">{q.customer_email}</p>
                        <p>₹{q.amount}</p>

                        <p className="text-xs text-gray-400">
                          {timeAgo(q.updated_at || q.created_at)}
                        </p>

                        <span className="text-xs bg-blue-50 px-2 py-1 rounded">
                          {getSmartMessage(q)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

        </div>
      </div>

    </div>
  )
}