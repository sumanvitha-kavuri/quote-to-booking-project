"use client"

import { logEvent } from "@/lib/events"

export default function PayDepositButton({
  amount,
  quoteId
}: {
  amount: number
  quoteId: string
}) {

  async function payDeposit() {

    // 🔥 LOG EVENT
    await logEvent(quoteId, "payment_started", "Customer started payment")

    const res = await fetch("/api/create-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount,
        quoteId
      })
    })

    const data = await res.json()

    window.location.href = data.url
  }

  return (
    <button
      onClick={payDeposit}
      className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
    >
      Pay Deposit
    </button>
  )
}