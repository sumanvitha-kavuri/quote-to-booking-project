import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"

export default async function Dashboard() {

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: quotes } = await supabase
    .from("quotes")
    .select("*")
    .eq("user_id", user.id)

  const total = quotes?.length || 0

  return (
    <main className="min-h-screen bg-slate-50 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Overview of your quotes
          </p>
        </div>

        {/* 🔥 CREATE BUTTON */}
        <a
          href="/dashboard/quotes/new"
          className="bg-slate-900 text-white px-4 py-2 rounded-lg"
        >
          + Create Quote
        </a>
      </div>

      {/* STATS */}
      <div className="mb-6">
        <p className="text-gray-600">Total Quotes</p>
        <p className="text-2xl font-bold">{total}</p>
      </div>

      {/* LIST */}
      <div className="bg-white p-4 rounded-xl border">

        <h2 className="font-semibold mb-4">Recent Quotes</h2>

        {quotes?.length === 0 && (
          <p className="text-sm text-gray-500">No quotes yet</p>
        )}

        <div className="space-y-3">
          {quotes?.map((q: any) => (
            <div key={q.id} className="p-3 border rounded">
              <p className="font-medium">{q.customer_name}</p>
              <p className="text-sm text-gray-500">{q.customer_email}</p>
              <p className="text-sm">₹{q.amount}</p>
            </div>
          ))}
        </div>

      </div>

    </main>
  )
}