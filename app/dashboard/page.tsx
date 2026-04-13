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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        Loading Dashboard...
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-800">
      {/* SIDEBAR - Changed to WHITE for professional look */}
      <div className="w-72 bg-white border-r border-slate-200 h-screen px-6 py-8 flex flex-col justify-between">
        <div>
          {/* PROFILE - Clean Layout */}
          <div className="flex items-center gap-3 mb-10 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
              {profile?.name?.[0] || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {profile?.name || "User Name"}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* NAV - Business Blue accents */}
          <div className="space-y-1">
            <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold transition-all">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-all">
              <FileText className="w-4 h-4" />
              All Quotes
            </button>

            <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-all">
              <AlertCircle className="w-4 h-4" />
              Needs Action
            </button>

            <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-all">
              <BarChart3 className="w-4 h-4" />
              Lost Quotes
            </button>
          </div>
        </div>

        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.replace("/")
          }}
          className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          Logout
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* NAVBAR */}
        <div className="flex justify-between items-center px-8 py-4 bg-white border-b border-slate-200">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            QUOTES <span className="text-blue-600">&</span> BOOKING
          </h1>

          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/")} className="p-2 hover:bg-slate-50 rounded-lg transition-all text-slate-400">
              <Home className="w-5 h-5" />
            </button>

            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 hover:bg-slate-50 rounded-lg transition-all text-slate-400">
                <Bell className="w-5 h-5" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-50">
                  {notifications.length === 0
                    ? <p className="text-sm text-slate-400 text-center py-2 font-medium">No notifications</p>
                    : notifications.map((n, i) => (
                      <div key={i} className="text-sm p-3 hover:bg-slate-50 rounded-lg text-slate-700 border-b border-slate-100 last:border-0 font-medium">
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
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
              <div>
                <p className="text-blue-600 text-[11px] font-bold uppercase tracking-[0.15em] mb-1">Commercial Dashboard</p>
                {/* Dialed back boldness */}
                <h2 className="text-2xl font-bold text-slate-900">
                  Welcome back, {profile?.name || user?.email?.split("@")[0]}
                </h2>
              </div>
              <button
                onClick={() => router.push("/dashboard/quotes/new")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md shadow-blue-200 font-semibold transition-all text-sm"
              >
                + New Quote
              </button>
            </div>

            {/* PIPELINE STATS */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* TOTAL PIPELINE -> PALE BLUE */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">Total Pipeline</p>
                <h3 className="text-2xl font-semibold text-slate-800">
                  ₹{totalPipelineValue.toLocaleString()}
                </h3>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Money Waiting</p>
                <h3 className="text-2xl font-semibold text-slate-800">
                  ₹{moneyWaiting.toLocaleString()}
                </h3>
              </div>
              {/* NEEDS ACTION -> RED */}
              <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                <p className="text-[11px] font-bold text-red-600 uppercase tracking-wider mb-1">Needs Action</p>
                <h3 className="text-2xl font-semibold text-red-700">
                  {needsActionCount} <span className="text-base font-medium opacity-70">Quotes</span>
                </h3>
              </div>
            </div>

            {/* ACTION REQUIRED -> PALE YELLOW */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="text-yellow-800 font-bold mb-4 text-[11px] uppercase tracking-widest flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5" /> High Priority Items
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {pendingQuotes.length > 0 && <p className="text-sm font-medium text-yellow-900 py-2 px-3 bg-white/60 rounded-lg border border-yellow-100">{pendingQuotes.length} Pending</p>}
                {openedQuotes.length > 0 && <p className="text-sm font-medium text-yellow-900 py-2 px-3 bg-white/60 rounded-lg border border-yellow-100">{openedQuotes.length} Viewed</p>}
                {changeRequested.length > 0 && <p className="text-sm font-medium text-yellow-900 py-2 px-3 bg-white/60 rounded-lg border border-yellow-100">{changeRequested.length} Requests</p>}
                {unpaidAccepted.length > 0 && <p className="text-sm font-medium text-yellow-900 py-2 px-3 bg-white/60 rounded-lg border border-yellow-100">{unpaidAccepted.length} Unpaid</p>}
              </div>
            </div>

            {/* KANBAN */}
            <div className="overflow-x-auto pb-6">
              <div className="flex gap-6 min-w-max">
                {[
                  { title: "Opened", key: "opened", color: "text-slate-500" },
                  { title: "Awaiting", key: "awaiting_response", color: "text-blue-600" },
                  { title: "Accepted", key: "accepted", color: "text-emerald-600" },
                  { title: "Paid", key: "paid", color: "text-indigo-600" },
                  { title: "Ready", key: "schedule_ready", color: "text-purple-600" },
                ].map((col) => {
                  const columnQuotes = quotes.filter(q => {
                    if (col.key === "awaiting_response") return q.status === "pending" || q.status === "awaiting_response"
                    return q.status === col.key
                  })

                  return (
                    <div key={col.key} className="w-72 bg-slate-100/40 border border-slate-200 rounded-xl p-4">
                      <h3 className={`mb-5 font-bold text-[10px] uppercase tracking-wider flex items-center justify-between px-1 ${col.color}`}>
                        {col.title} 
                        <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-500">{columnQuotes.length}</span>
                      </h3>
                      <div className="space-y-3">
                        {columnQuotes.map((q) => {
                          const urgency = getUrgency(q)
                          return (
                            <div
                              key={q.id}
                              onClick={() => router.push(`/dashboard/quotes/${q.id}`)}
                              className={`bg-white border p-4 rounded-lg cursor-pointer shadow-sm hover:border-blue-400 transition-all
                                ${urgency === "high" ? "border-red-200" : "border-slate-200"}
                              `}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <p className="font-semibold text-slate-900 text-[13px] truncate">{q.customer_name}</p>
                                {urgency === "high" && <div className="w-1.5 h-1.5 rounded-full bg-red-600" />}
                              </div>
                              <p className="text-[10px] text-slate-400 truncate mb-3 font-medium">{q.customer_email}</p>
                              <p className="text-base font-bold text-slate-800">₹{q.amount?.toLocaleString()}</p>
                              
                              <div className="mt-3 pt-3 border-t border-slate-50 flex flex-col gap-2">
                                <p className="text-[9px] text-slate-400 font-bold uppercase">Activity: {timeAgo(q.updated_at || q.created_at)}</p>
                                <span className={`text-[9px] px-2 py-1 rounded font-bold uppercase text-center 
                                  ${urgency === "high" ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-600"}`}>
                                  {getSmartMessage(q)}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                        {columnQuotes.length === 0 && <p className="text-[10px] text-slate-400 text-center font-medium py-4">No data</p>}
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