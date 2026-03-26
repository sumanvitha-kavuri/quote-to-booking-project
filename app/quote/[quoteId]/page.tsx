"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import AcceptQuoteButton from "@/components/AcceptQuoteButton"
import PayDepositButton from "@/components/PayDepositButton"
import AskQuestionBox from "@/components/AskQuestionBox"
import RequestChangeButton from "@/components/RequestChangeButton"
import DeclineQuoteButton from "@/components/DeclineQuoteButton"

export default function QuotePage({ params }: any) {
  const { quoteId } = params

  const [quote, setQuote] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    markOpened()
  }, [])

  async function fetchData() {
    const { data: quoteData, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", quoteId)
      .single()

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    setQuote(quoteData)

    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .eq("quote_id", quoteId)
      .order("created_at", { ascending: false })

    setEvents(eventsData || [])
    setLoading(false)
  }

  // 🔥 TRACK OPENED
  async function markOpened() {
    await supabase
      .from("quotes")
      .update({ status: "opened" })
      .eq("id", quoteId)
  }

  if (loading) {
    return <div className="p-10">Loading...</div>
  }

  if (!quote) {
    return <div className="p-10">Quote not found</div>
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex justify-center p-4 md:p-6">

      <div className="w-full max-w-xl bg-white border rounded-2xl shadow-xl p-5 md:p-6">

        {/* HEADER */}
        <h1 className="text-xl md:text-2xl font-bold mb-6 text-center">
          Quote Details
        </h1>

        {/* SUMMARY */}
        <div className="space-y-3 mb-6">

          <p><span className="font-medium">Customer:</span> {quote.customer_name}</p>
          <p><span className="font-medium">Email:</span> {quote.customer_email}</p>

          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-xl font-bold text-gray-900">
              ₹{quote.amount}
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">Deposit Required</p>
            <p className="text-xl font-bold text-blue-700">
              ₹{quote.deposit_amount}
            </p>
          </div>

          <div className="flex justify-between text-sm mt-2">
            <span>Status:</span>
            <span className="font-medium">{quote.status}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Payment:</span>
            <span className="font-medium">{quote.payment_status}</span>
          </div>

        </div>

        {/* ACTIONS */}
        {(quote.status === "pending" || quote.status === "opened") && (
          <div className="space-y-3 mb-6">

            <AcceptQuoteButton quoteId={quote.id} />
            <PayDepositButton amount={quote.deposit_amount} quoteId={quote.id} />

            <div className="flex gap-2">
              <RequestChangeButton quoteId={quote.id} />
              <DeclineQuoteButton quoteId={quote.id} />
            </div>

            <AskQuestionBox quoteId={quote.id} />

          </div>
        )}

        {/* TIMELINE */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Timeline</h2>

          {events.length === 0 && (
            <p className="text-sm text-gray-500">No activity yet</p>
          )}

          <div className="space-y-2">
            {events.map((event: any) => (
              <div key={event.id} className="border rounded-lg p-3 bg-white shadow-sm">
                <p className="text-sm">{event.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(event.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>

    </main>
  )
}