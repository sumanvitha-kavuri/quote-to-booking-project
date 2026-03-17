"use client"

import { supabase } from "@/lib/supabase"

export default function DeclineQuoteButton({ quoteId }: { quoteId: string }) {

  async function declineQuote() {

    const { error } = await supabase
      .from("quotes")
      .update({
        status: "declined"
      })
      .eq("id", quoteId)

    if (error) {
      alert("Failed to decline quote")
    } else {
      alert("Quote declined")
      window.location.reload()
    }
  }

  return (
    <button
      onClick={declineQuote}
      className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
    >
      Decline Quote
    </button>
  )
}