"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function QuoteDetail() {
  const { id } = useParams()
  const [quote, setQuote] = useState<any>(null)

  useEffect(() => {
    fetchQuote()
  }, [])

  async function fetchQuote() {
    const { data } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .single()

    setQuote(data)
  }

  if (!quote) {
    return <div className="p-6 text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-6">

      <h1 className="text-2xl font-semibold mb-4">
        Quote Details
      </h1>

      <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">

        <p><strong>Customer:</strong> {quote.customer_name}</p>
        <p><strong>Email:</strong> {quote.customer_email}</p>
        <p><strong>Amount:</strong> ₹{quote.amount}</p>
        <p><strong>Status:</strong> {quote.status}</p>

      </div>

      {/* HISTORY */}
      <div className="mt-6">
        <h2 className="text-lg font-medium mb-2">History</h2>

        <div className="text-sm text-gray-400 space-y-1">
          <p>• Quote created</p>
          {quote.status === "accepted" && <p>• Accepted by customer</p>}
          {quote.status === "paid" && <p>• Payment received</p>}
        </div>
      </div>

    </div>
  )
}