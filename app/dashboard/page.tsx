"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function NewQuotePage() {
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [depositAmount, setDepositAmount] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    console.log("Submitting quote...")

    const { data, error } = await supabase.from("quotes").insert([
      {
        customer_name: customerName,
        customer_email: customerEmail,
        job_description: jobDescription,
        amount: Number(amount),
        deposit_amount: Number(depositAmount),
      },
    ])

    console.log(data, error)

    if (error) {
      alert("Error saving quote")
    } else {
      alert("Quote saved successfully!")
    }
  }

  return (
    <main className="p-10 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Create Quote</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          className="border p-2 rounded"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Customer Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Job Description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Total Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Deposit Amount"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
        />

        <button
          type="submit"
          className="bg-black text-white p-2 rounded"
        >
          Create Quote
        </button>

      </form>
    </main>
  )
}