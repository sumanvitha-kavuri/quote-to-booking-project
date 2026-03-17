"use client"

import { supabase } from "@/lib/supabase"

export default function RequestChangeButton({ quoteId }: { quoteId: string }) {

  async function requestChange() {

    const { error } = await supabase
      .from("quotes")
      .update({
        status: "revision_requested"
      })
      .eq("id", quoteId)

    if (error) {
      alert("Failed to request change")
    } else {
      alert("Revision request sent")
      window.location.reload()
    }
  }

  return (
    <button
      onClick={requestChange}
      className="mt-4 bg-orange-500 text-white px-4 py-2 rounded"
    >
      Request Change
    </button>
  )
}