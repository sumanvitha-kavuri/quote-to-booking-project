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

  // --- Logic Helpers ---
  const pendingQuotes = quotes.filter(q => q.status === "pending" || q.status === "awaiting_response")
  const openedQuotes = quotes.filter(q => q.status === "opened")
  const changeRequested = quotes.filter(q => q.status === "rejected")
  const unpaidAccepted = quotes.filter(q => q.status === "accepted" && q.payment_status !== "paid")
  
  const totalPipelineValue = quotes.reduce((sum, q) => sum + (q.amount || 0), 0)
  const moneyWaiting = quotes
    .filter(q => q.status === "accepted" && q.payment_status !== "paid")
    .reduce((sum, q) => sum + (q.amount || 0), 0)

  const needsActionCount = pendingQuotes.length + openedQuotes.length + changeRequested.length + unpaidAccepted.length

  function getSmartMessage(q: any) {
    const last = new Date(q.updated_at || q.created_at).getTime()
    const now = Date.now()
    const days = Math.floor((now - last) / (1000 * 60 * 60 * 24))

    if (q.status === "pending" || q.status === "opened") {
      if (days >= 2) return `Follow-up overdue by ${days}d`
      if (days >= 1) return `Follow up today`
      return "Recently contacted"
    }
    if (q.status === "accepted" && q.payment_status !== "paid") return days >= 2 ? `Payment overdue by ${days}d` : "Waiting for payment"
    if (q.status === "rejected") return "Revise and resend"
    if (q.status === "paid") return "Ready to schedule"
    return "No action needed"
  }

  function getUrgency(q: any) {
    const last = new Date(q.updated_at || q.created_at).getTime()
    const diffHours = (Date.now() - last) / (1000 * 60 * 60)
    if (diffHours > 48) return "high"
    if (diffHours > 24) return "medium"
    return "low"
  }

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-medium tracking-tight">Initializing Dashboard...</div>

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-slate-900">
      
      {/* SIDEBAR - Premium Aesthetic */}
      <aside className="w-80 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 h-screen px-6 py-10 flex flex-col justify-between shadow-[4px_0_24px_-10px_rgba(0,0,0,0.05)] z-20">
        <div>
          {/* PROFILE CARD */}
          <div className="group flex items-center gap-4 mb-12 p-4 rounded-2xl bg-white border border-slate-100 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_12px_25px_-5px_rgba(0,0,0,0.08)]">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-200/50 group-hover:scale-105 transition-transform">
                {profile?.name?.[0] || "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 tracking-tight truncate leading-tight">
                {profile?.name || "Admin"}
              </p>
              <p className="text-[10px] text-slate-400 truncate font-bold uppercase tracking-widest mt-0.5">
                Portal Access
              </p>
            </div>
          </div>

          {/* NAV LINKS */}
          <nav className="space-y-1.5">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
            
            <button className="w-full group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-blue-600 text-white text-sm font-bold shadow-xl shadow-blue-600/20 transition-all">
              <LayoutDashboard className="w-5 h-5 opacity-90" />
              Dashboard
            </button>

            {[
              { icon: FileText, label: "All Quotes" },
              { icon: AlertCircle, label: "Needs Action" },
              { icon: BarChart3, label: "Analytics" },
              { icon: Bell, label: "Activity" },
            ].map((item) => (
              <button key={item.label} className="w-full group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-white hover:text-blue-600 hover:shadow-sm hover:ring-1 hover:ring-slate-100 transition-all hover:translate-x-1 text-sm font-semibold">
                <item.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* LOGOUT - Minimalist Footer */}
        <div className="pt-6 border-t border-slate-100">
          <button
            onClick={async () => { await supabase.auth.signOut(); router.replace("/"); }}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 transition-all active:scale-[0.97]"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            Logout Account
          </button>
        </div>
      </aside>

      {/* RIGHT SIDE MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* TOP NAVBAR */}
        <header className="flex justify-between items-center px-8 py-4 bg-white border-b border-slate-200/60 z-10">
          <h1 className="text-sm font-bold text-slate-900 tracking-[0.15em] uppercase">
            Management <span className="text-blue-600">/</span> Pipeline
          </h1>

          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/")} className="p-2 hover:bg-slate-50 rounded-xl border border-slate-200 bg-white transition-all">
              <Home className="w-4 h-4 text-slate-600" />
            </button>

            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 hover:bg-slate-50 rounded-xl border border-slate-200 bg-white transition-all relative">
                <Bell className="w-4 h-4 text-slate-600" />
                {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50">
                  {notifications.length === 0
                    ? <p className="text-xs text-slate-400 text-center py-6 font-medium">No new activity to report</p>
                    : notifications.map((n, i) => (
                      <div key={i} className="text-xs p-4 hover:bg-slate-50 rounded-xl text-slate-600 border-b border-slate-50 last:border-0 font-medium transition-colors">
                        {n}
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* WELCOME & ACTION */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
              <div>
                <p className="text-blue-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Operations Center</p>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back, {profile?.name || "Team Member"}
                </h2>
              </div>
              <button
                onClick={() => router.push("/dashboard/quotes/new")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl shadow-lg shadow-blue-600/20 font-bold transition-all text-sm active:scale-95"
              >
                + Create New Quote
              </button>
            </div>

            {/* KPI STATS */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Pipeline</p>
                <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tighter">₹{totalPipelineValue.toLocaleString()}</h3>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-[2rem] p-8 shadow-sm">
                <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest">Money Waiting</p>
                <h3 className="text-3xl font-black text-emerald-700 mt-2 tracking-tighter">₹{moneyWaiting.toLocaleString()}</h3>
              </div>
              <div className={`rounded-[2rem] p-8 shadow-sm border transition-colors ${needsActionCount === 0 ? "bg-white border-slate-100" : "bg-rose-50 border-rose-100"}`}>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${needsActionCount === 0 ? "text-slate-400" : "text-rose-600"}`}>Urgent Actions</p>
                <h3 className={`text-3xl font-black mt-2 tracking-tighter ${needsActionCount === 0 ? "text-slate-900" : "text-rose-700"}`}>
                  {needsActionCount} <span className="text-sm font-bold opacity-60 uppercase tracking-normal ml-1">Tasks</span>
                </h3>
              </div>
            </div>

            {/* PRIORITY FOLLOW-UPS */}
            <section className="bg-yellow-50/50 border border-yellow-200/60 rounded-[2rem] p-6 cursor-pointer hover:bg-yellow-50 transition-all shadow-sm">
              <h3 className="text-slate-800 font-bold mb-5 text-[10px] uppercase tracking-[0.15em] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" /> Priority Follow-ups
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { count: pendingQuotes.length, label: "Pending", color: "text-slate-600" },
                  { count: openedQuotes.length, label: "Viewed", color: "text-blue-600" },
                  { count: changeRequested.length, label: "Revisions", color: "text-amber-600" },
                  { count: unpaidAccepted.length, label: "Unpaid", color: "text-rose-600" }
                ].map((item) => (
                  item.count > 0 && (
                    <div key={item.label} className="bg-white/80 p-3 rounded-xl border border-yellow-200/50 flex flex-col">
                      <span className={`text-xl font-black ${item.color}`}>{item.count}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.label}</span>
                    </div>
                  )
                ))}
              </div>
            </section>

            {/* KANBAN BOARD */}
            <div className="overflow-x-auto pb-10 -mx-4 px-4">
              <div className="flex gap-6 min-w-max">
                {[
                  { title: "Opened", key: "opened", color: "bg-slate-400" },
                  { title: "Awaiting", key: "awaiting_response", color: "bg-blue-500" },
                  { title: "Accepted", key: "accepted", color: "bg-orange-500" },
                  { title: "Paid", key: "paid", color: "bg-emerald-500" },
                  { title: "Ready", key: "schedule_ready", color: "bg-violet-500" },
                ].map((col) => {
                  const columnQuotes = quotes.filter(q => col.key === "awaiting_response" ? (q.status === "pending" || q.status === "awaiting_response") : q.status === col.key)

                  return (
                    <div key={col.key} className="w-72">
                      <div className="flex items-center justify-between px-2 mb-6">
                        <h3 className="font-bold text-[11px] uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${col.color}`}></span>
                          {col.title}
                        </h3>
                        <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">{columnQuotes.length}</span>
                      </div>
                      
                      <div className="space-y-4">
                        {columnQuotes.map((q) => {
                          const urgency = getUrgency(q)
                          return (
                            <div
                              key={q.id}
                              onClick={() => router.push(`/dashboard/quotes/${q.id}`)}
                              className={`bg-white border p-5 rounded-2xl cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all group
                                ${urgency === "high" ? "border-l-4 border-l-rose-500" : "border-slate-100"}
                              `}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <p className="font-bold text-slate-900 text-sm truncate">{q.customer_name}</p>
                                {urgency === "high" && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 ring-4 ring-rose-50" />}
                              </div>
                              <p className="text-[11px] text-slate-400 font-medium truncate mb-4">{q.customer_email}</p>
                              <p className="text-xl font-black text-slate-900 tracking-tight">₹{q.amount?.toLocaleString()}</p>
                              
                              <div className="mt-5 pt-4 border-t border-slate-50 flex flex-col gap-3">
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Activity: {timeAgo(q.updated_at || q.created_at)}</p>
                                <span className={`text-[10px] px-3 py-2 rounded-xl font-bold uppercase text-center 
                                  ${urgency === "high" ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"}`}>
                                  {getSmartMessage(q)}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                        {columnQuotes.length === 0 && (
                          <div className="border-2 border-dashed border-slate-200/60 rounded-3xl py-12 flex flex-col items-center justify-center">
                            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.2em]">Clear</p>
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
      </main>
    </div>
  )
}