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
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] text-[#6b7280]">
        Loading Dashboard...
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#f3f4f6] overflow-hidden text-[#111827]">
      {/* SIDEBAR - Upgraded Padding, Theme and Increased Section Size */}
      <div className="w-80 bg-[#111827] border-r border-[#1f2937] h-screen px-6 py-8 flex flex-col justify-between">
        <div>
          {/* PROFILE - Professional Slate Aesthetics */}
          <div className="flex items-center gap-4 mb-12 p-3 rounded-2xl bg-[#1f2937] border border-[#1f2937]">
            <div className="w-12 h-12 rounded-full bg-[#374151] flex items-center justify-center text-white font-bold text-lg">
              {profile?.name?.[0] || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {profile?.name || "User Name"}
              </p>
              <p className="text-xs text-[#9ca3af] truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* NAV - Larger spacing and sleek corporate tones */}
          <div className="space-y-2">
            <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl bg-[#374151] text-white text-sm font-medium shadow-lg shadow-[#374151]/10 transition-all">
              <LayoutDashboard className="w-5 h-5 text-[#9ca3af]" />
              Dashboard
            </button>

            <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-white hover:bg-[#1f2937] text-sm transition-all">
              <FileText className="w-5 h-5 text-[#9ca3af]" />
              All Quotes
            </button>

            <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-white hover:bg-[#1f2937] text-sm transition-all">
              <AlertCircle className="w-5 h-5 text-[#9ca3af]" />
              Needs Action
            </button>

            <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-white hover:bg-[#1f2937] text-sm transition-all">
              <BarChart3 className="w-5 h-5 text-[#9ca3af]" />
              Lost Quotes
            </button>

            <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-white hover:bg-[#1f2937] text-sm transition-all">
              <Bell className="w-5 h-5 text-[#9ca3af]" />
              Activity
            </button>
          </div>
        </div>

        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.replace("/")
          }}
          className="w-full text-left px-5 py-3.5 rounded-xl text-sm font-medium text-[#9ca3af] hover:bg-[#1f2937] hover:text-white transition-all"
        >
          Logout
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* NAVBAR */}
        <div className="flex justify-between items-center px-8 py-5 bg-white border-b border-[#e5e7eb]">
          <h1 className="text-xl font-bold text-[#111827]">
            Quotes <span className="text-[#6b7280] font-medium">&</span> Booking
          </h1>

          <div className="flex items-center gap-5">
            <button onClick={() => router.push("/")} className="p-2 hover:bg-[#f3f4f6] rounded-full transition-all">
              <Home className="w-5 h-5 text-[#111827]" />
            </button>

            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 hover:bg-[#f3f4f6] rounded-full transition-all">
                <Bell className="w-5 h-5 text-[#111827]" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-72 bg-white border border-[#e5e7eb] rounded-2xl shadow-2xl p-4 z-50">
                  {notifications.length === 0
                    ? <p className="text-sm text-[#9ca3af] text-center py-2">No notifications</p>
                    : notifications.map((n, i) => (
                      <div key={i} className="text-sm p-3 hover:bg-[#f3f4f6] rounded-xl text-[#111827] border-b border-[#e5e7eb] last:border-0">
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
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
              <div>
                <p className="text-[#6b7280] text-sm font-medium uppercase tracking-widest mb-1">Overview</p>
                <h2 className="text-4xl font-bold text-[#111827]">
                  Welcome back, {profile?.name || user?.email?.split("@")[0]}
                </h2>
              </div>
              <button
                onClick={() => router.push("/dashboard/quotes/new")}
                className="bg-[#111827] hover:bg-[#1f2937] text-white px-7 py-3 rounded-xl shadow-lg shadow-[#111827]/20 font-bold transition-all"
              >
                + New Quote
              </button>
            </div>

            {/* PIPELINE STATS - Soft Corporate Gray Backgrounds */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-[#e5e7eb] rounded-3xl p-7 shadow-sm">
                <p className="text-xs font-bold text-[#6b7280] uppercase tracking-wider">Total Pipeline</p>
                <h3 className="text-3xl font-bold text-[#111827] mt-2">
                  ₹{totalPipelineValue.toLocaleString()}
                </h3>
              </div>
              <div className="bg-white border border-[#e5e7eb] rounded-3xl p-7 shadow-sm">
                <p className="text-xs font-bold text-[#6b7280] uppercase tracking-wider">Money Waiting</p>
                <h3 className="text-3xl font-bold text-[#374151] mt-2">
                  ₹{moneyWaiting.toLocaleString()}
                </h3>
              </div>
              <div className="bg-white border border-[#e5e7eb] rounded-3xl p-7 shadow-sm">
                <p className="text-xs font-bold text-[#6b7280] uppercase tracking-wider">Needs Action</p>
                <h3 className="text-3xl font-bold text-[#dc2626] mt-2">
                  {needsActionCount} <span className="text-lg font-medium opacity-60">Quotes</span>
                </h3>
              </div>
            </div>

            {/* ACTION REQUIRED - Minimal High Contrast Alert */}
            <div className="bg-white border border-[#e5e7eb] rounded-3xl p-7 shadow-inner">
              <h3 className="text-[#111827] font-bold mb-4 text-xs uppercase tracking-[0.2em]">Priority Follow-ups</h3>
              <div className="space-y-3">
                {pendingQuotes.length > 0 && <p className="text-sm text-[#6b7280] flex items-center gap-2 cursor-pointer hover:text-[#111827]">• <span>{pendingQuotes.length} pending quotes</span></p>}
                {openedQuotes.length > 0 && <p className="text-sm text-[#6b7280] flex items-center gap-2 cursor-pointer hover:text-[#111827]">• <span>{openedQuotes.length} opened (no response)</span></p>}
                {changeRequested.length > 0 && <p className="text-sm text-[#6b7280] flex items-center gap-2 cursor-pointer hover:text-[#111827]">• <span>{changeRequested.length} change requests</span></p>}
                {unpaidAccepted.length > 0 && <p className="text-sm text-[#6b7280] flex items-center gap-2 cursor-pointer hover:text-[#111827]">• <span>{unpaidAccepted.length} unpaid accepted quotes</span></p>}
              </div>
            </div>

            {/* KANBAN */}
            <div className="overflow-x-auto pb-6">
              <div className="flex gap-6 min-w-max">
                {[
                  { title: "Opened", key: "opened", color: "text-[#1f2937]" },
                  { title: "Awaiting", key: "awaiting_response", color: "text-[#374151]" },
                  { title: "Accepted", key: "accepted", color: "text-[#4b5563]" },
                  { title: "Paid", key: "paid", color: "text-[#6b7280]" },
                  { title: "Ready", key: "schedule_ready", color: "text-[#9ca3af]" },
                ].map((col) => {
                  const columnQuotes = quotes.filter(q => {
                    if (col.key === "awaiting_response") return q.status === "pending" || q.status === "awaiting_response"
                    return q.status === col.key
                  })

                  return (
                    <div key={col.key} className="w-[280px] bg-white border border-[#e5e7eb] rounded-[2rem] p-5">
                      <h3 className={`mb-5 font-bold text-sm flex items-center justify-between px-2 ${col.color}`}>
                        {col.title} 
                        <span className="text-[10px] bg-[#f9fafb] border border-[#e5e7eb] px-2 py-0.5 rounded-full">{columnQuotes.length}</span>
                      </h3>
                      <div className="space-y-4">
                        {columnQuotes.map((q) => {
                          const urgency = getUrgency(q)
                          return (
                            <div
                              key={q.id}
                              onClick={() => router.push(`/dashboard/quotes/${q.id}`)}
                              className={`bg-white border p-5 rounded-2xl cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                                ${urgency === "high" ? "border-[#dc2626]/30 bg-[#fef2f2]" : "border-[#e5e7eb]"}
                              `}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <p className="font-bold text-[#111827] text-sm truncate">{q.customer_name}</p>
                                {urgency === "high" && <div className="w-2 h-2 rounded-full bg-[#dc2626] shadow-sm animate-pulse" />}
                              </div>
                              <p className="text-[10px] text-[#6b7280] truncate mb-3 italic">{q.customer_email}</p>
                              <p className="text-lg font-bold text-[#111827]">₹{q.amount?.toLocaleString()}</p>
                              
                              <div className="mt-4 pt-4 border-t border-[#f3f4f6] flex flex-col gap-2">
                                <p className="text-[10px] text-[#6b7280] font-medium">Activity: {timeAgo(q.updated_at || q.created_at)}</p>
                                <span className="text-[9px] px-2 py-1 rounded-lg bg-[#f3f4f6] text-[#1f2937] font-bold uppercase tracking-wider text-center">{getSmartMessage(q)}</span>
                              </div>
                            </div>
                          )
                        })}
                        {columnQuotes.length === 0 && <p className="text-[10px] text-[#6b7280] text-center italic py-4">No items active</p>}
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