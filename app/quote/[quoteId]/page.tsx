import { supabase } from "@/lib/supabase"
import AcceptQuoteButton from "@/components/AcceptQuoteButton"
import PayDepositButton from "@/components/PayDepositButton"
import AskQuestionBox from "@/components/AskQuestionBox"
import RequestChangeButton from "@/components/RequestChangeButton"
import DeclineQuoteButton from "@/components/DeclineQuoteButton"

export default async function QuotePage({ params }: any) {

  const { quoteId } = await params

  const { data: quote, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", quoteId)
    .single()

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("quote_id", quoteId)
    .order("created_at", { ascending: false })

  if (error) {
    console.log(error)
    return <div className="p-10">Error loading quote</div>
  }

  if (!quote) {
    return <div className="p-10">Quote not found</div>
  }

  return (
    <main className="p-10 max-w-xl">

      <h1 className="text-3xl font-bold mb-6">
        Quote Details
      </h1>

      <div className="space-y-4">
        <p><b>Customer:</b> {quote.customer_name}</p>
        <p><b>Email:</b> {quote.customer_email}</p>
        <p><b>Total Amount:</b> ${quote.amount}</p>
        <p><b>Deposit Required:</b> ${quote.deposit_amount}</p>
        <p><b>Status:</b> {quote.status}</p>
        <p><b>Payment:</b> {quote.payment_status}</p>
      </div>

      {quote.status === "pending" && (
        <>
          <AcceptQuoteButton quoteId={quote.id} />
          <RequestChangeButton quoteId={quote.id} />
          <DeclineQuoteButton quoteId={quote.id} />
          <AskQuestionBox quoteId={quote.id} />
        </>
      )}

      <PayDepositButton
        amount={quote.deposit_amount}
        quoteId={quote.id}
      />

      {/* 🔥 Timeline */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Timeline</h2>

        {events?.length === 0 && (
          <p className="text-sm text-gray-500">No activity yet</p>
        )}

        {events?.map((event: any) => (
          <div key={event.id} className="border p-3 rounded mb-2">
            <p className="text-sm">{event.message}</p>
            <p className="text-xs text-gray-500">
              {new Date(event.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

    </main>
  )
}