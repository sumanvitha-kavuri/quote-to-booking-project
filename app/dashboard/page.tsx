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
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-900">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#fcfcfd] overflow-hidden text-slate-900">
      {/* SIDEBAR - NOW WHITE & UNIFIED */}
      <div className="w-64 bg-white border-r border-slate-200 h-screen px-4 py-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              {profile?.name?.[0] || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
                {profile?.name || "User"}
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-blue-50 text-blue-700 text-sm font-semibold transition-all">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50 text-sm font-medium transition-all">
              <FileText className="w-4 h-4" />
              Quotes
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50 text-sm font-medium transition-all">
              <AlertCircle className="w-4 h-4" />
              Actions
            </button>
          </nav>
        </div>

        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.replace("/")
          }}
          className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:text-red-600 transition-all"
        >
          Logout
        </button>
      </div>

      {/* MAIN UI */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* NAVBAR */}
        <div className="flex justify-between items-center px-8 py-4 bg-white border-b border-slate-200">
          <h1 className="text-sm font-black text-slate-900 tracking-widest uppercase">
            CRM <span className="text-blue-600">Core</span>
          </h1>
          <div className="flex items-center gap-4">
             <Bell className="w-5 h-5 text-slate-400 cursor-pointer" />
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#f8f9fa]">
          <div className="max-w-6xl mx-auto space-y-8">
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl font-bold text-slate-900">
                Welcome, {profile?.name || "User"}
              </h2>
              <button
                onClick={() => router.push("/dashboard/quotes/new")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded shadow-sm font-bold text-sm transition-all"
              >
                + CREATE QUOTE
              </button>
            </div>

            {/* KPI STATS - HIGH CONTRAST */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border-l-4 border-l-blue-500 border border-slate-200 p-6 shadow-sm">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Pipeline</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">₹{totalPipelineValue.toLocaleString()}</h3>
              </div>
              <div className="bg-white border-l-4 border-l-slate-400 border border-slate-200 p-6 shadow-sm">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Money Waiting</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">₹{moneyWaiting.toLocaleString()}</h3>
              </div>
              <div className="bg-white border-l-4 border-l-red-500 border border-slate-200 p-6 shadow-sm">
                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Needs Action</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{needsActionCount} Quotes</h3>
              </div>
            </div>

            {/* PRIORITY SECTION - INTEGRATED PALETTE */}
            <div className="bg-white border border-slate-200 border-l-4 border-l-yellow-500 p-6">
              <h3 className="text-slate-900 font-bold mb-4 text-xs uppercase tracking-widest">Immediate Actions</h3>
              <div className="flex flex-wrap gap-3">
                {pendingQuotes.length > 0 && <span className="bg-yellow-50 text-yellow-800 text-[11px] font-bold px-3 py-1 border border-yellow-100">{pendingQuotes.length} PENDING</span>}
                {openedQuotes.length > 0 && <span className="bg-blue-50 text-blue-800 text-[11px] font-bold px-3 py-1 border border-blue-100">{openedQuotes.length} VIEWED</span>}
                {changeRequested.length > 0 && <span className="bg-red-50 text-red-800 text-[11px] font-bold px-3 py-1 border border-red-100">{changeRequested.length} REVISIONS</span>}
              </div>
            </div>

            {/* KANBAN - STRONGER CARDS */}
            <div className="overflow-x-auto pb-6">
              <div className="flex gap-6 min-w-max">
                {[
                  { title: "Opened", key: "opened", color: "bg-slate-900" },
                  { title: "Awaiting", key: "awaiting_response", color: "bg-blue-600" },
                  { title: "Accepted", key: "accepted", color: "bg-emerald-600" },
                  { title: "Paid", key: "paid", color: "bg-indigo-600" },
                ].map((col) => {
                  const columnQuotes = quotes.filter(q => col.key === "awaiting_response" ? (q.status === "pending" || q.status === "awaiting_response") : q.status === col.key)

                  return (
                    <div key={col.key} className="w-72">
                      <div className="flex items-center gap-2 mb-4">
                         <div className={`w-2 h-2 rounded-full ${col.color}`} />
                         <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-700">{col.title} ({columnQuotes.length})</h3>
                      </div>
                      
                      <div className="space-y-4">
                        {columnQuotes.map((q) => {
                          const urgency = getUrgency(q)
                          return (
                            <div
                              key={q.id}
                              onClick={() => router.push(`/dashboard/quotes/${q.id}`)}
                              className={`bg-white border-2 p-4 cursor-pointer hover:border-blue-600 shadow-sm transition-all
                                ${urgency === "high" ? "border-red-200" : "border-slate-100"}
                              `}
                            >
                              <p className="font-bold text-slate-900 text-sm mb-1 truncate">{q.customer_name}</p>
                              <p className="text-[10px] text-slate-500 mb-3 font-semibold">{q.customer_email}</p>
                              <p className="text-lg font-black text-slate-900 mb-3">₹{q.amount?.toLocaleString()}</p>
                              
                              <div className="pt-3 border-t border-slate-50">
                                <span className={`text-[9px] px-2 py-1 font-black uppercase rounded ${urgency === "high" ? "bg-red-600 text-white" : "bg-slate-100 text-slate-600"}`}>
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