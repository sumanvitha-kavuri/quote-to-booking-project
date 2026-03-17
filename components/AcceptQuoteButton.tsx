"use client"

import { supabase } from "@/lib/supabase"
import { logEvent } from "@/lib/events"

export default function AcceptQuoteButton({ quoteId }: { quoteId: string }) {

  async function acceptQuote() {
    const { error } = await supabase
      .from("quotes")
      .update({ status: "accepted" })
      .eq("id", quoteId)

    if (error) {
      alert("Error accepting quote")
    } else {

      // 🔥 LOG EVENT
      await logEvent(quoteId, "approved", "Customer approved the quote")

      alert("Quote accepted!")
      window.location.reload()
    }
  }

  return (
    <button
      onClick={acceptQuote}
      className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
    >
      Accept Quote
    </button>
  )
}