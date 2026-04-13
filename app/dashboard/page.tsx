"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { 
  Home, 
  Bell, 
  LayoutDashboard, 
  FileText, 
  AlertCircle, 
  BarChart3 
} from "lucide-react"

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

  function handleFocus(section: "pending" | "accepted" | "paid") {
    setFocus(section)
    document.getElementById(section)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  }

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
  const totalPipelineValue = quotes.reduce((sum, q) => sum + (q.amount || 0), 0)

  const moneyWaiting = quotes
    .filter(q => q.status === "accepted" && q.payment_status !== "paid")
    .reduce((sum, q) => sum + (q.amount || 0), 0)

  const needsActionCount =
    pendingQuotes.length +
    openedQuotes.length +
    changeRequested.length +
    unpaidAccepted.length

  function getNextAction(q: any) {
    if (q.status === "pending") return "Send follow-up"
    if (q.status === "opened") return "Follow up (customer viewed)"
    if (q.status === "accepted" && q.payment_status !== "paid") return "Collect payment"
    if (q.status === "rejected") return "Revise quote"
    if (q.status === "paid") return "Schedule job"
    if (q.status === "schedule_ready") return "Confirm schedule"
    return "No action"
  }

  function getSmartMessage(q: any) {
    const last = new Date(q.updated_at || q.created_at).getTime()
    const now = Date.now()
    const diffHours = (now - last) / (1000 * 60 * 60)
    const days = Math.floor(diffHours / 24)

    if (q.status === "pending" || q.status === "opened") {
      if (days >= 2) return `Follow-up overdue by ${days}d`
      if (days >= 1) return `Follow up today`
      return "Recently contacted"
    }

    if (q.status === "accepted" && q.payment_status !== "paid") {
      if (days >= 2) return `Payment overdue by ${days}d`
      return "Waiting for payment"
    }

    if (q.status === "rejected") {
      return "Revise and resend"
    }

    if (q.status === "paid") {
      return "Ready to schedule"
    }

    if (q.status === "schedule_ready") {
      return "Confirm schedule"
    }

    return "No action needed"
  }

  function getUrgency(q: any) {
    const last = new Date(q.updated_at || q.created_at).getTime()
    const now = new Date().getTime()
    const diffHours = (now - last) / (1000 * 60 * 60)

    if (diffHours > 48) return "high"
    if (diffHours > 24) return "medium"
    return "low"
  }

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`

    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-slate-900">
      {/* SIDEBAR - Clean White with Large Spacing */}
      <div className="w-80 bg-white border-r border-slate-200 h-screen px-6 py-8 flex flex-col justify-between">
        <div>
          {/* PROFILE - Minimal Grey Style */}
          <div className="flex items-center gap-4 mb-12 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-lg">
              {profile?.name?.[0] || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
                {profile?.name || "User Name"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* NAV - Professional Spacing */}
          <div className="space-y-2">
            <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-md transition-all">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>

            <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium transition-all">
              <FileText className="w-5 h-5" />
              All Quotes
            </button>

            <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium transition-all">
              <AlertCircle className="w-5 h-5" />
              Needs Action
            </button>

            <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium transition-all">
              <BarChart3 className="w-5 h-5" />
              Lost Quotes
            </button>

            <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium transition-all">
              <Bell className="w-5 h-5" />
              Activity
            </button>
          </div>
        </div>

        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.replace("/")
          }}
          className="w-full text-left px-5 py-3.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          Logout
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* NAVBAR */}
        <div className="flex justify-between items-center px-8 py-5 bg-white border-b border-slate-200">
          <h1 className="text-xl font-bold">
            Quotes <span className="text-blue-600">to Booking</span>
          </h1>

          <div className="flex items-center gap-5">
            <button onClick={() => router.push("/")} className="p-2 hover:bg-slate-100 rounded-full">
              <Home className="w-5 h-5 text-slate-500" />
            </button>

            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 hover:bg-slate-100 rounded-full">
                <Bell className="w-5 h-5 text-slate-500" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50">
                  {notifications.length === 0
                    ? <p className="text-sm text-slate-500 text-center py-2">No notifications</p>
                    : notifications.map((n, i) => (
                      <div key={i} className="text-sm p-3 hover:bg-slate-50 rounded-xl border-b last:border-0">
                        {n}
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-3xl font-bold text-slate-900">
                Welcome, {profile?.name || user?.email?.split("@")[0]}
              </h2>
              <button
                onClick={() => router.push("/dashboard/quotes/new")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all"
              >
                + New Quote
              </button>
            </div>

            {/* PIPELINE STATS - Different Shades */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-100 rounded-3xl p-7">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Total Pipeline</p>
                <h3 className="text-3xl font-black text-blue-900 mt-2">
                  ₹{totalPipelineValue.toLocaleString()}
                </h3>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-3xl p-7">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Money Waiting</p>
                <h3 className="text-3xl font-black text-amber-900 mt-2">
                  ₹{moneyWaiting.toLocaleString()}
                </h3>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-3xl p-7">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Needs Action</p>
                <h3 className="text-3xl font-black text-red-900 mt-2">
                  {needsActionCount} Quotes
                </h3>
              </div>
            </div>

            {/* ACTION REQUIRED - Pale Yellow */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-7 shadow-sm">
              <h3 className="text-yellow-800 font-bold mb-4 text-sm uppercase tracking-widest">⚠️ Action Required</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-yellow-900 font-medium">
                {pendingQuotes.length > 0 && <p>• {pendingQuotes.length} pending quotes</p>}
                {openedQuotes.length > 0 && <p>• {openedQuotes.length} opened (no response)</p>}
                {changeRequested.length > 0 && <p>• {changeRequested.length} change requests</p>}
                {unpaidAccepted.length > 0 && <p>• {unpaidAccepted.length} unpaid accepted quotes</p>}
              </div>
            </div>

            {/* KANBAN */}
            <div className="overflow-x-auto pb-6">
              <div className="flex gap-6 min-w-max">
                {[
                  { title: "OPENED", key: "opened", color: "text-blue-600", bg: "bg-blue-100" },
                  { title: "AWAITING", key: "awaiting_response", color: "text-amber-600", bg: "bg-amber-100" },
                  { title: "ACCEPTED", key: "accepted", color: "text-green-600", bg: "bg-green-100" },
                  { title: "PAID", key: "paid", color: "text-emerald-600", bg: "bg-emerald-100" },
                  { title: "READY", key: "schedule_ready", color: "text-purple-600", bg: "bg-purple-100" },
                ].map((col) => {
                  const columnQuotes = quotes.filter(q => {
                    if (col.key === "awaiting_response") return q.status === "pending" || q.status === "awaiting_response"
                    return q.status === col.key
                  })

                  return (
                    <div key={col.key} className="w-[300px]">
                      {/* Highlighted Big Headings */}
                      <div className={`flex items-center justify-between mb-5 px-4 py-3 rounded-2xl ${col.bg}`}>
                        <h3 className={`font-black text-lg ${col.color}`}>
                          {col.title}
                        </h3>
                        <span className={`text-sm font-bold px-2.5 py-1 rounded-full bg-white ${col.color}`}>
                          {columnQuotes.length}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {columnQuotes.map((q) => {
                          const urgency = getUrgency(q)
                          return (
                            <div
                              key={q.id}
                              onClick={() => router.push(`/dashboard/quotes/${q.id}`)}
                              className={`bg-slate-50 border p-5 rounded-2xl cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                                ${urgency === "high" ? "border-red-300 ring-1 ring-red-100" : "border-slate-200"}
                              `}
                            >
                              <div className="flex justify-between items-start">
                                <p className="font-bold text-slate-900 text-sm">{q.customer_name}</p>
                                {urgency === "high" && <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />}
                              </div>
                              <p className="text-xs text-slate-500 truncate mt-1">{q.customer_email}</p>
                              
                              <p className="text-xl font-black text-slate-900 mt-4">₹{q.amount?.toLocaleString()}</p>
                              
                              <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col gap-2">
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Last Active: {timeAgo(q.updated_at || q.created_at)}</p>
                                <span className="text-[10px] px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-center">
                                  {getSmartMessage(q)}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}