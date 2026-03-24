"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    init()
  }, [])

  async function init() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.replace("/login")
      return
    }

    setUser(user)

    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("user_id", user.id)

    if (error) {
      console.log("Error fetching quotes:", error)
    }

    setQuotes(data || [])
    setLoading(false)
  }

  if (loading) {
    return <p className="p-10">Loading dashboard...</p>
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Logged in as: {user?.email}
          </p>
        </div>

        <a
          href="/dashboard/quotes/new"
          className="bg-slate-900 text-white px-4 py-2 rounded-lg"
        >
          + Create Quote
        </a>
        <a
  href="/dashboard/profile"
  className="text-sm text-gray-600 hover:underline"
>
  Profile
</a>
      </div>

      {/* STATS */}
      <div className="mb-6">
        <p className="text-gray-600">Total Quotes</p>
        <p className="text-2xl font-bold">{quotes.length}</p>
      </div>

      {/* LIST */}
      <div className="bg-white p-4 rounded-xl border space-y-3">

        {quotes.length === 0 && (
          <p className="text-gray-500">No quotes yet</p>
        )}

        {quotes.map((q) => (
          <div key={q.id} className="p-3 border rounded">
            <p className="font-medium">{q.customer_name}</p>
            <p className="text-sm text-gray-500">{q.customer_email}</p>
            <p className="text-sm">₹{q.amount}</p>
          </div>
        ))}

      </div>

    </main>
  )
}