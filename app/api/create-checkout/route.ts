import Stripe from "stripe"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {

  const body = await req.json()
  const amount = body.amount
  const quoteId = body.quoteId

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],

    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Deposit Payment",
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],

    mode: "payment",

    metadata: {
      quoteId: quoteId
    },

    success_url: "http://localhost:3000/payment-success",
    cancel_url: "http://localhost:3000",
  })

  return NextResponse.json({ url: session.url })
}