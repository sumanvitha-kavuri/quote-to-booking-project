import { NextResponse } from "next/server"
import { sendQuoteEmail } from "@/lib/email"

export async function POST(req: Request) {

  const body = await req.json()

  await sendQuoteEmail(
    body.email,
    body.name,
    body.quoteId
  )

  return NextResponse.json({ success: true })
}