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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-medium">
        Loading Dashboard...
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden text-slate-900">
      {/* SIDEBAR - Light Theme Applied */}
      <div className="w-72 bg-white border-r border-slate-200 h-screen px-4 py-8 flex flex-col justify-between">
        <div>
          {/* PROFILE - Updated to Light Theme */}
          <div className="flex items-center gap-3 mb-10 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-inner">
              {profile?.name?.[0] || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {profile?.name || "User Name"}
              </p>
              <p className="text-[11px] text-slate-500 truncate font-medium">
                {user?.email}
              </p>
            </div>
          </div>

          {/* NAV - Updated to Light Theme + Blue Accents */}
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium shadow-sm transition-all">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-sm font-medium transition-all">
              <FileText className="w-4 h-4" />
              All Quotes
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-sm font-medium transition-all">
              <AlertCircle className="w-4 h-4" />
              Needs Action
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-sm font-medium transition-all">
              <BarChart3 className="w-4 h-4" />
              Lost Quotes
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-sm font-medium transition-all">
              <Bell className="w-4 h-4" />
              Activity
            </button>
          </div>
        </div>

        {/* LOGOUT - Updated to proper action button */}
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.replace("/")
          }}
          className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 border border-slate-200 transition-all"
        >
          Logout
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* NAVBAR */}
        <div className="flex justify-between items-center px-8 py-4 bg-white border-b border-slate-200">
          <h1 className="text-lg font-medium text-slate-900 tracking-tight">
            Quote to Booking
          </h1>

          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/")} className="p-2 hover:bg-slate-50 rounded-lg border border-slate-300 bg-white transition-all">
              <Home className="w-4 h-4 text-slate-700" />
            </button>

            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 hover:bg-slate-50 rounded-lg border border-slate-300 bg-white transition-all relative">
                <Bell className="w-4 h-4 text-slate-700" />
                {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50">
                  {notifications.length === 0
                    ? <p className="text-xs text-slate-400 text-center py-4">No new activity</p>
                    : notifications.map((n, i) => (
                      <div key={i} className="text-xs p-3 hover:bg-slate-50 rounded-lg text-slate-600 border-b border-slate-50 last:border-0">
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
        <div className="flex-1 overflow-y-auto p-8 lg:p-10 bg-slate-50/30">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
              <div>
                <p className="text-blue-600 text-[11px] font-bold uppercase tracking-widest mb-1">Manager Overview</p>
                <h2 className="text-2xl font-bold text-slate-900">
                  Welcome back, {profile?.name || user?.email?.split("@")[0]}
                </h2>
              </div>
              <button
                onClick={() => router.push("/dashboard/quotes/new")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-sm font-semibold transition-all text-sm"
              >
                + New Quote
              </button>
            </div>

            {/* PIPELINE STATS - Color Refreshed */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Pipeline</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  ₹{totalPipelineValue.toLocaleString()}
                </h3>
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 shadow-sm">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Money Waiting</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  ₹{moneyWaiting.toLocaleString()}
                </h3>
              </div>
              <div className={`rounded-xl p-6 shadow-sm border ${needsActionCount === 0 ? "bg-white border-slate-200 text-slate-900" : "bg-red-50 border-red-100 text-red-900"}`}>
                <p className={`text-[11px] font-bold uppercase tracking-wider ${needsActionCount === 0 ? "text-slate-500" : "text-red-600"}`}>Needs Action</p>
                <h3 className="text-2xl font-bold mt-1">
                  {needsActionCount} <span className="text-sm font-medium opacity-70">Quotes</span>
                </h3>
              </div>
            </div>

            {/* ACTION REQUIRED - Yellow + Clickable Feel */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 cursor-pointer hover:bg-yellow-100 transition">
              <h3 className="text-slate-900 font-bold mb-4 text-[11px] uppercase tracking-widest flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-yellow-600" /> Priority Follow-ups
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {pendingQuotes.length > 0 && <p className="text-xs font-semibold text-slate-600 py-2 px-3 bg-white rounded-lg border border-yellow-200"> {pendingQuotes.length} Pending</p>}
                {openedQuotes.length > 0 && <p className="text-xs font-semibold text-blue-600 py-2 px-3 bg-white rounded-lg border border-yellow-200"> {openedQuotes.length} Viewed</p>}
                {changeRequested.length > 0 && <p className="text-xs font-semibold text-amber-600 py-2 px-3 bg-white rounded-lg border border-yellow-200"> {changeRequested.length} Requests</p>}
                {unpaidAccepted.length > 0 && <p className="text-xs font-semibold text-rose-600 py-2 px-3 bg-white rounded-lg border border-yellow-200"> {unpaidAccepted.length} Unpaid</p>}
              </div>
            </div>

            {/* KANBAN */}
            <div className="overflow-x-auto pb-6">
              <div className="flex gap-5 min-w-max">
                {[
                  { title: "Opened", key: "opened", color: "bg-slate-500" },
                  { title: "Awaiting", key: "awaiting_response", color: "bg-blue-500" },
                  { title: "Accepted", key: "accepted", color: "bg-orange-500" },
                  { title: "Paid", key: "paid", color: "bg-emerald-500" },
                  { title: "Ready", key: "schedule_ready", color: "bg-violet-500" },
                ].map((col) => {
                  const columnQuotes = quotes.filter(q => {
                    if (col.key === "awaiting_response") return q.status === "pending" || q.status === "awaiting_response"
                    return q.status === col.key
                  })

                  return (
                    <div key={col.key} className="w-[280px]">
                      <h3 className="mb-4 font-bold text-[11px] uppercase tracking-wider flex items-center justify-between px-1 text-slate-700">
                        <span className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${col.color}`}></span>
                          {col.title}
                        </span>
                        <span className="text-[10px] text-slate-600 font-medium bg-slate-200 px-2 py-0.5 rounded-full">{columnQuotes.length}</span>
                      </h3>
                      <div className="space-y-3">
                        {columnQuotes.map((q) => {
                          const urgency = getUrgency(q)
                          return (
                            <div
                              key={q.id}
                              onClick={() => router.push(`/dashboard/quotes/${q.id}`)}
                              className={`bg-white border p-4 rounded-xl cursor-pointer shadow-sm hover:shadow-md hover:border-blue-200 transition-all
                                ${urgency === "high" ? "border-l-4 border-l-rose-500" : "border-slate-200"}
                              `}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <p className="font-bold text-slate-900 text-sm truncate leading-tight">{q.customer_name}</p>
                                {urgency === "high" && <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                              </div>
                              <p className="text-[11px] text-slate-400 truncate mb-3">{q.customer_email}</p>
                              <p className="text-lg font-bold text-slate-900 tracking-tight">₹{q.amount?.toLocaleString()}</p>
                              
                              <div className="mt-4 pt-3 border-t border-slate-50 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Updated {timeAgo(q.updated_at || q.created_at)}</p>
                                </div>
                                <span className={`text-[10px] px-2 py-1.5 rounded-md font-bold uppercase tracking-tight text-center 
                                  ${urgency === "high" ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-600 border border-slate-100"}`}>
                                  {getSmartMessage(q)}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                        {columnQuotes.length === 0 && (
                          <div className="border-2 border-dashed border-slate-200 rounded-xl py-8 flex flex-col items-center justify-center">
                            <p className="text-[10px] text-slate-300 font-bold uppercase">Empty</p>
                          </div>
                        )}
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