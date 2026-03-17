"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AskQuestionBox({ quoteId }: { quoteId: string }) {

  const [question, setQuestion] = useState("")

  async function submitQuestion() {

    const { error } = await supabase
      .from("quotes")
      .update({
        status: "question_pending",
        customer_question: question
      })
      .eq("id", quoteId)

    if (error) {
      alert("Failed to send question")
    } else {
      alert("Question sent to business")
      window.location.reload()
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-2">
      <textarea
        className="border p-2 rounded"
        placeholder="Ask a question about this quote"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={submitQuestion}
        className="bg-yellow-500 text-white px-4 py-2 rounded"
      >
        Ask Question
      </button>
    </div>
  )
}