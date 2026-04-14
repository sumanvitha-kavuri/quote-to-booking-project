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
  BarChart3 ,
  LogOut,
  ChevronRight,
  Plus
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
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] text-slate-400 font-medium">
        <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-sm tracking-tight">Syncing your workflow...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#FDFDFD] overflow-hidden text-slate-900 font-sans selection:bg-blue-100">
      {/* SIDEBAR - Premium Minimalist */}
      <div className="w-64 bg-white border-r border-slate-100 h-screen px-6 py-10 flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div>
          {/* LOGO AREA */}
          <div className="flex items-center gap-2 mb-12 px-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <LayoutDashboard className="w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight text-lg">WorkFlow</span>
          </div>

          {/* NAV */}
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50 text-blue-600 text-sm font-semibold transition-all">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium transition-all group">
              <FileText className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
              Quotes
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium transition-all group">
              <AlertCircle className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
              Pending
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium transition-all group">
              <BarChart3 className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
              Analytics
            </button>
          </div>
        </div>

        {/* PROFILE & LOGOUT */}
        <div className="space-y-4">
          <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 border border-white shadow-sm flex items-center justify-center text-[10px] font-bold">
                    {profile?.name?.[0] || "U"}
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate leading-none mb-1">{profile?.name || "Member"}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                </div>
            </div>
          </div>
          
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.replace("/")
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 transition-all border border-transparent hover:border-rose-100"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER BAR */}
        <header className="h-16 flex justify-between items-center px-8 bg-white/80 backdrop-blur-md border-b border-slate-100 z-10">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-[0.15em]">
            Command Center
          </h2>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)} 
                className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 rounded-full transition-colors relative"
              >
                <Bell className="w-4 h-4 text-slate-600" />
                {notifications.length > 0 && <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-600 rounded-full ring-2 ring-white animate-pulse"></span>}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 z-50 ring-1 ring-black/5">
                  <p className="text-[10px] font-bold text-slate-400 px-3 py-2 uppercase tracking-widest">Recent Activity</p>
                  {notifications.length === 0
                    ? <p className="text-xs text-slate-400 text-center py-6 italic">No new events</p>
                    : notifications.map((n, i) => (
                      <div key={i} className="text-[11px] p-3 hover:bg-slate-50 rounded-lg text-slate-700 font-medium flex gap-2 items-start border-b border-slate-50 last:border-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0"></div>
                        {n}
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
            
            <button
                onClick={() => router.push("/dashboard/quotes/new")}
                className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg shadow-md shadow-slate-200 font-bold transition-all text-xs flex items-center gap-2"
            >
                <Plus className="w-3.5 h-3.5" />
                Create Quote
            </button>
          </div>
        </header>

        {/* VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-10 bg-[#FCFCFD]">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* HERO SECTION */}
            <section className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Good morning, {profile?.name?.split(" ")[0] || "Partner"}
                </h1>
                <p className="text-slate-400 text-sm font-medium">Here is what is happening across your projects today.</p>
            </section>

            {/* KEY METRICS - Apple Card Style */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm ring-1 ring-slate-200/50">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Pipeline Value</span>
                <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold tracking-tighter">₹{totalPipelineValue.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm ring-1 ring-slate-200/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform"></div>
                <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest relative z-10">Revenue Waiting</span>
                <div className="flex items-baseline gap-1 mt-2 relative z-10">
                    <span className="text-3xl font-bold tracking-tighter text-emerald-600">₹{moneyWaiting.toLocaleString()}</span>
                </div>
              </div>

              <div className={`rounded-2xl p-6 shadow-sm border transition-all ring-1 ${needsActionCount === 0 ? "bg-white border-slate-100 ring-slate-200/50" : "bg-white border-rose-100 ring-rose-200/20 shadow-rose-100/20"}`}>
                <span className={`text-[10px] font-extrabold uppercase tracking-widest ${needsActionCount === 0 ? "text-slate-400" : "text-rose-500"}`}>Action Required</span>
                <div className="flex items-baseline gap-2 mt-2">
                    <span className={`text-3xl font-bold tracking-tighter ${needsActionCount === 0 ? "text-slate-900" : "text-rose-600"}`}>{needsActionCount}</span>
                    <span className="text-xs font-bold text-slate-400">Quotes</span>
                </div>
              </div>
            </section>

            {/* PRIORITY ALERTS */}
            <section className="bg-[#1e293b] rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
                <h3 className="text-white font-bold mb-6 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 relative z-10">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                    Focus Items
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Stale</p>
                        <p className="text-white font-bold text-lg">{pendingQuotes.length}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Viewed</p>
                        <p className="text-white font-bold text-lg">{openedQuotes.length}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Revision</p>
                        <p className="text-white font-bold text-lg">{changeRequested.length}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Unpaid</p>
                        <p className="text-white font-bold text-lg">{unpaidAccepted.length}</p>
                    </div>
                </div>
            </section>

            {/* KANBAN BOARD */}
            <section className="space-y-6 pb-20">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="font-bold text-sm text-slate-900 tracking-tight">Workflow States</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Automated Tracking On</p>
              </div>
              
              <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
                {[
                  { title: "Opened", key: "opened", color: "bg-slate-400" },
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
                    <div key={col.key} className="w-[300px] shrink-0">
                      <div className="flex items-center justify-between mb-5 px-1">
                        <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${col.color}`}></div>
                            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">{col.title}</span>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full ring-1 ring-slate-200/50">
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
                              className={`group bg-white border border-slate-100 p-5 rounded-2xl cursor-pointer shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-100 hover:-translate-y-1 transition-all duration-300
                                ${urgency === "high" ? "ring-1 ring-rose-100 bg-rose-50/10" : ""}
                              `}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-[13px] tracking-tight group-hover:text-blue-600 transition-colors">{q.customer_name}</h4>
                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{q.customer_email}</p>
                                </div>
                                {urgency === "high" && <div className="w-2 h-2 rounded-full bg-rose-500 ring-4 ring-rose-50" />}
                              </div>

                              <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-xs font-bold text-slate-400">₹</span>
                                <span className="text-xl font-bold tracking-tighter text-slate-900">{q.amount?.toLocaleString()}</span>
                              </div>
                              
                              <div className="pt-4 border-t border-slate-50">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Active {timeAgo(q.updated_at || q.created_at)}</span>
                                  </div>
                                  <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                                </div>
                                <div className={`text-[10px] py-2 px-3 rounded-lg font-bold uppercase tracking-tight text-center transition-colors
                                  ${urgency === "high" ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"}`}>
                                  {getSmartMessage(q)}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                        {columnQuotes.length === 0 && (
                          <div className="border-2 border-dashed border-slate-100 rounded-2xl py-12 flex flex-col items-center justify-center bg-slate-50/30">
                            <span className="text-[9px] text-slate-300 font-extrabold uppercase tracking-widest">No Active Jobs</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}