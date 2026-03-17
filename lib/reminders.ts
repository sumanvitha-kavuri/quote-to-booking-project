import { supabase } from "@/lib/supabase"
import { logEvent } from "@/lib/events"

export async function sendReminderEmails() {

  const { data: quotes } = await supabase
    .from("quotes")
    .select("*")
    .eq("status", "pending")

  if (!quotes) return

  for (const quote of quotes) {

    const createdAt = new Date(quote.created_at)
    const now = new Date()

    const hoursPassed =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)

    // First reminder
    if (hoursPassed > 0.01 && quote.reminder_count === 0) {

      await fetch("http://localhost:3000/api/send-quote-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: quote.customer_email,
          name: quote.customer_name,
          quoteId: quote.id,
        }),
      })

      await supabase.from("quotes")
        .update({
          reminder_count: 1,
          last_reminder_sent: new Date()
        })
        .eq("id", quote.id)

      // 🔥 LOG EVENT
      await logEvent(quote.id, "reminder", "Reminder email sent")
    }

    // Second reminder
    if (hoursPassed > 0.02 && quote.reminder_count === 1) {

      await fetch("http://localhost:3000/api/send-quote-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: quote.customer_email,
          name: quote.customer_name,
          quoteId: quote.id,
        }),
      })

      await supabase.from("quotes")
        .update({
          reminder_count: 2,
          last_reminder_sent: new Date()
        })
        .eq("id", quote.id)

      // 🔥 LOG EVENT
      await logEvent(quote.id, "reminder", "Final reminder sent")
    }
  }
}