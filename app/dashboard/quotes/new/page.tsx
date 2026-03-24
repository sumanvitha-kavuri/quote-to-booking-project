"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { logEvent } from "@/lib/events"

export default function NewQuotePage() {

  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [amount, setAmount] = useState("")
  const [depositAmount, setDepositAmount] = useState("")
  const [quoteLink, setQuoteLink] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setLoading(true)

    // 🔒 get logged-in user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert("You must be logged in")
      setLoading(false)
      return
    }

    // 🔥 insert quote
    const { data, error } = await supabase
      .from("quotes")
      .insert([
        {
          customer_name: customerName,
          customer_email: customerEmail,
          amount: Number(amount),
          deposit_amount: Number(depositAmount),
          status: "pending",
          user_id: user.id,
        }
      ])
      .select()

    if (error) {
      console.log("Supabase error:", error)
      alert(error.message)
      setLoading(false)
      return
    }

    const id = data?.[0]?.id
    const link = `https://quote-to-booking-project.vercel.app/quote/${id}`

    setQuoteLink(link)
    setLoading(false)

    // 🔥 background stuff
    logEvent(id, "quote_created", "Quote created")

    fetch(`${window.location.origin}/api/send-quote-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: customerEmail,
        name: customerName,
        quoteId: id,
      }),
    })

    logEvent(id, "email_sent", "Quote email sent")
  }

  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center p-6">
  
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-semibold mb-8 text-center">
          Create Quote
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <input
            className="border p-3 rounded w-full focus:ring-2 focus:ring-black outline-none"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <input
            className="border p-3 rounded w-full focus:ring-2 focus:ring-black outline-none"
            placeholder="Customer Email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />

          <input
            className="border p-3 rounded w-full focus:ring-2 focus:ring-black outline-none"
            placeholder="Total Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            className="border p-3 rounded w-full focus:ring-2 focus:ring-black outline-none"
            placeholder="Deposit Amount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />

          <button
            disabled={loading}
            className="bg-black text-white py-3 rounded-lg mt-4 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Quote"}
          </button>

        </form>

        {quoteLink && (
          <div className="mt-8 p-4 bg-gray-100 rounded">
            <p className="font-medium">Quote created</p>
            <input
              value={quoteLink}
              readOnly
              className="w-full mt-2 p-2 border rounded"
            />
          </div>
        )}

      </div>

    </main>
  )
}