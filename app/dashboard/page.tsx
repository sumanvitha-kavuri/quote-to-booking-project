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
  BarChart3,
  LogOut
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
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-400">
        Loading Dashboard...
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#FBFBFC] overflow-hidden text-slate-900">
      {/* 1) SIDEBAR - Light Professional Slate */}
      <div className="w-64 bg-slate-50 border-r border-slate-200 h-screen px-4 py-8 flex flex-col justify-between">
        <div>
          {/* PROFILE - Defined Light Card */}
          <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="w-9 h-9 rounded-md bg-indigo-600 flex items-center justify-center text-white font-medium text-sm">
              {profile?.name?.[0] || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {profile?.name || "User Name"}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium transition-all">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-sm font-medium transition-all">
              <FileText className="w-4 h-4" />
              All Quotes
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-sm font-medium transition-all">
              <AlertCircle className="w-4 h-4" />
              Needs Action
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-sm font-medium transition-all">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
          </div>
        </div>

        {/* 2) LOGOUT - Enhanced Visibility */}
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.replace("/")
          }}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 7 & 8) NAVBAR - Defined Heading & Visible Buttons */}
        <div className="flex justify-between items-center px-8 py-4 bg-white border-b border-slate-200">
          <h1 className="text-md font-medium text-slate-500 tracking-tight uppercase">
            Quote <span className="text-indigo-600">to</span> Booking
          </h1>

          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/")} className="p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all shadow-sm">
              <Home className="w-4 h-4 text-slate-700" />
            </button>

            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all shadow-sm">
                <Bell className="w-4 h-4 text-slate-700" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50">
                  {notifications.length === 0 ? <p className="text-xs text-slate-400 p-4 text-center">No alerts</p> : 
                    notifications.map((n, i) => <div key={i} className="text-xs p-3 border-b border-slate-50">{n}</div>)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-[#FBFBFC]">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-slate-800">Overview</h2>
              <button onClick={() => router.push("/dashboard/quotes/new")} className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all">
                + New Quote
              </button>
            </div>

            {/* 6) PIPELINE STATS - Functional Coloring */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6">
                <p className="text-xs font-medium text-blue-600 uppercase">Total Pipeline</p>
                <h3 className="text-2xl font-semibold text-slate-900 mt-1">₹{totalPipelineValue.toLocaleString()}</h3>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-6">
                <p className="text-xs font-medium text-emerald-600 uppercase">Money Waiting</p>
                <h3 className="text-2xl font-semibold text-slate-900 mt-1">₹{moneyWaiting.toLocaleString()}</h3>
              </div>
              {/* Needs Action Logic */}
              <div className={`${needsActionCount > 0 ? "bg-rose-50 border-rose-100" : "bg-white border-slate-200"} border rounded-xl p-6 transition-colors`}>
                <p className={`text-xs font-medium uppercase ${needsActionCount > 0 ? "text-rose-600" : "text-slate-500"}`}>Needs Action</p>
                <h3 className="text-2xl font-semibold text-slate-900 mt-1">{needsActionCount} Tasks</h3>
              </div>
            </div>

            {/* 3) PRIORITY FOLLOWUPS - Clickable Yellow Container */}
            <div 
              onClick={() => handleFocus("pending")}
              className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 cursor-pointer hover:bg-yellow-100 transition-all group shadow-sm"
            >
              <h3 className="text-yellow-700 font-semibold mb-3 text-xs uppercase flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Priority Action Items
              </h3>
              <div className="flex gap-4">
                {pendingQuotes.length > 0 && <span className="text-xs font-medium bg-white px-3 py-1.5 rounded-md border border-yellow-200">{pendingQuotes.length} Pending</span>}
                {openedQuotes.length > 0 && <span className="text-xs font-medium bg-white px-3 py-1.5 rounded-md border border-yellow-200">{openedQuotes.length} Viewed</span>}
              </div>
            </div>

            {/* 5) KANBAN SECTIONING */}
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-6 min-w-max">
                {[
                  { title: "Opened", key: "opened", color: "bg-slate-100 text-slate-600" },
                  { title: "Awaiting", key: "awaiting_response", color: "bg-indigo-50 text-indigo-600" },
                  { title: "Accepted", key: "accepted", color: "bg-orange-50 text-orange-600", border: "border-l-4 border-l-orange-400" },
                  { title: "Paid", key: "paid", color: "bg-emerald-50 text-emerald-600" },
                ].map((col) => {
                  const columnQuotes = quotes.filter(q => col.key === "awaiting_response" ? (q.status === "pending" || q.status === "awaiting_response") : q.status === col.key)
                  
                  return (
                    <div key={col.key} id={col.key} className="w-[280px]">
                      {/* Section Heading Design */}
                      <div className={`${col.color} px-3 py-2 rounded-lg mb-4 flex justify-between items-center border border-transparent shadow-sm`}>
                        <span className="text-[11px] font-semibold uppercase tracking-wider">{col.title}</span>
                        <span className="text-[10px] font-bold opacity-70">{columnQuotes.length}</span>
                      </div>
                      
                      <div className="space-y-3">
                        {columnQuotes.map((q) => (
                          <div
                            key={q.id}
                            onClick={() => router.push(`/dashboard/quotes/${q.id}`)}
                            className={`bg-white border border-slate-200 p-4 rounded-xl cursor-pointer hover:shadow-md transition-all ${col.key === 'accepted' ? 'border-l-4 border-l-orange-400' : ''}`}
                          >
                            <p className="font-semibold text-slate-800 text-sm truncate">{q.customer_name}</p>
                            <p className="text-lg font-bold text-slate-900 mt-1">₹{q.amount?.toLocaleString()}</p>
                            <div className="mt-3 pt-3 border-t border-slate-50">
                              <span className="text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded-md border border-slate-100 font-medium">
                                {timeAgo(q.updated_at || q.created_at)}
                              </span>
                            </div>
                          </div>
                        ))}
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