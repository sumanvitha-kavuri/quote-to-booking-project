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

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()

  const { data, error } = await supabase
    .from("quotes")
    .insert([
      {
        customer_name: customerName,
        customer_email: customerEmail,
        amount: Number(amount),
        deposit_amount: Number(depositAmount),
        status: "pending"
      }
    ])
    .select()

  if (error) {
    console.log("Supabase error:", error)
    alert(error.message)
    return
  }

  const id = data?.[0]?.id
  const link = `https://quote-to-booking-project.vercel.app/quote/${id}`

  // 🔥 LOG: Quote created
  await logEvent(id, "quote_created", "Quote created")

  // Send email
  await fetch(`${window.location.origin}/api/send-quote-email`, {
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

  // 🔥 LOG: Email sent
  await logEvent(id, "email_sent", "Quote email sent")

  setQuoteLink(link)
}

  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center p-6">
  
<div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-lg text-black">

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

      <button className="bg-black text-white py-3 rounded-lg mt-4">
        Create Quote
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