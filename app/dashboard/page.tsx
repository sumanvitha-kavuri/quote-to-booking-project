"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function NewQuotePage() {
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [depositAmount, setDepositAmount] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setLoading(true)

    // 🔒 GET LOGGED IN USER
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert("You are not logged in")
      setLoading(false)
      return
    }

    // 🔥 INSERT WITH user_id
    const { error } = await supabase.from("quotes").insert([
      {
        customer_name: customerName,
        customer_email: customerEmail,
        job_description: jobDescription,
        amount: Number(amount),
        deposit_amount: Number(depositAmount),
        status: "pending",
        user_id: user.id,
      },
    ])

    if (error) {
      console.log("ERROR:", error)
      alert("Error saving quote")
      setLoading(false)
      return
    }

    // ✅ SUCCESS
    alert("Quote created successfully!")

    // 🔄 RESET FORM
    setCustomerName("")
    setCustomerEmail("")
    setJobDescription("")
    setAmount("")
    setDepositAmount("")
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">

      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-xl">

        <h1 className="text-2xl font-semibold mb-6 text-center">
          Create Quote
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            className="border p-3 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <input
            className="border p-3 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
            placeholder="Customer Email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />

          <input
            className="border p-3 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
            placeholder="Job Description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <input
            type="number"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
            placeholder="Total Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            type="number"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
            placeholder="Deposit Amount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Quote"}
          </button>

        </form>

      </div>

    </main>
  )
}