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
{/* PIPELINE STATS */}
<div className="grid md:grid-cols-3 gap-4">

  {/* Total Pipeline */}
  <div className="bg-white border rounded-2xl p-5 shadow-sm">
    <p className="text-sm text-gray-500">Total Pipeline</p>
    <h3 className="text-2xl font-semibold text-gray-900 mt-1">
      ₹{totalPipelineValue.toLocaleString()}
    </h3>
    <p className="text-xs text-gray-400 mt-1">
      Estimated from all quotes
    </p>
  </div>

  {/* Money Waiting */}
  <div className="bg-white border rounded-2xl p-5 shadow-sm">
    <p className="text-sm text-gray-500">Money Waiting</p>
    <h3 className="text-2xl font-semibold text-yellow-600 mt-1">
      ₹{moneyWaiting.toLocaleString()}
    </h3>
    <p className="text-xs text-gray-400 mt-1">
      Accepted but not paid
    </p>
  </div>

  {/* Needs Action */}
  <div className="bg-white border rounded-2xl p-5 shadow-sm">
    <p className="text-sm text-gray-500">Needs Action</p>
    <h3 className="text-2xl font-semibold text-red-500 mt-1">
      {needsActionCount} quotes
    </h3>
    <p className="text-xs text-gray-400 mt-1">
      Follow-ups required
    </p>
  </div>

</div>
        {/* ACTION REQUIRED */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-5 shadow-sm">
          <h3 className="text-yellow-800 font-semibold mb-3">Action Required</h3>

          {pendingQuotes.length > 0 && (
            <p className="cursor-pointer hover:underline">
              • {pendingQuotes.length} pending quotes
            </p>
          )}

          {openedQuotes.length > 0 && (
            <p className="cursor-pointer hover:underline">
              • {openedQuotes.length} opened but no response
            </p>
          )}

          {changeRequested.length > 0 && (
            <p className="cursor-pointer hover:underline">
              • {changeRequested.length} change requests
            </p>
          )}

          {unpaidAccepted.length > 0 && (
            <p className="cursor-pointer hover:underline">
              • {unpaidAccepted.length} unpaid accepted quotes
            </p>
          )}
        </div>

        {/* KANBAN */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-5 min-w-max">

            {[
              { title: "Sent", key: "sent", color: "text-gray-500" },
              { title: "Opened", key: "opened", color: "text-blue-600" },
              { title: "Awaiting", key: "awaiting_response", color: "text-yellow-600" },
              { title: "Accepted", key: "accepted", color: "text-green-600" },
              { title: "Paid", key: "paid", color: "text-emerald-600" },
              { title: "Ready", key: "schedule_ready", color: "text-purple-600" },
              { title: "Lost", key: "rejected", color: "text-red-500" },
            ].map((col) => {

              const columnQuotes = quotes.filter(q => {
                if (col.key === "awaiting_response") {
                  return q.status === "pending" || q.status === "awaiting_response"
                }
                return q.status === col.key
              })

              return (
                <div
                  key={col.key}
                  className="w-[270px] bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all"
                >
                  <h3 className={`mb-4 font-semibold ${col.color}`}>
                    {col.title} ({columnQuotes.length})
                  </h3>

                  <div className="space-y-3">

                    {columnQuotes.map((q) => {

  const urgency = getUrgency(q)

  return (
    <div
      key={q.id}
      onClick={() => router.push(`/dashboard/quotes/${q.id}`)}
      className={`bg-white border p-4 rounded-xl cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all
        ${urgency === "high" ? "border-red-300" : ""}
        ${urgency === "medium" ? "border-yellow-300" : ""}
      `}
    >
      {urgency === "high" && (
  <p className="text-xs text-red-500 font-medium mb-2">⚠️ Urgent</p>
)}

{urgency === "medium" && (
  <p className="text-xs text-yellow-600 font-medium mb-1">⏳ Follow up soon</p>
)}
                        <p className="font-semibold text-gray-900 text-sm">
                          {q.customer_name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {q.customer_email}
                        </p>

                        <p className="text-base mt-1 font-semibold text-gray-900">
                          ₹{q.amount}
                        </p>
                          <p className="text-xs text-gray-500 mt-2">
                          {q.job_description || "Quote"}
                        </p>
<p className="text-xs text-gray-400 mt-2">
  Last activity: {timeAgo(q.updated_at || q.created_at)}
</p>

<div className="mt-2">
  <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">
    {getNextAction(q)}
  </span>
</div>
                      

                      </div>
  )
            })}

                    {columnQuotes.length === 0 && (
                      <p className="text-xs text-gray-400">
                        No items
                      </p>
                    )}

                  </div>
                </div>
              )
            })}

          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="mb-3 font-semibold">Recent Activity</h3>
          {notifications.slice(0, 5).map((n, i) => (
            <div key={i} className="p-2 border-b text-sm text-gray-600">
              {n}
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}