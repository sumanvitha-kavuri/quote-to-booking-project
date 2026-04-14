"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { 
  ArrowLeft, 
  User, 
  Mail, 
  IndianRupee, 
  Clock, 
  FileText,
  CheckCircle2,
  Calendar,
  History
} from "lucide-react"

export default function QuoteDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [quote, setQuote] = useState<any>(null)

  useEffect(() => {
    fetchQuote()
  }, [])

  async function fetchQuote() {
    const { data } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .single()

    setQuote(data)
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 text-zinc-400 font-medium">
        Loading Details...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900">
      {/* HEADER BAR */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-3 py-1 rounded-lg font-black uppercase border 
              ${quote.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                quote.status === 'accepted' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
              {quote.status}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto p-6 md:p-10 space-y-8">
        {/* TITLE SECTION */}
        <div>
          <p className="text-indigo-600 text-[11px] font-bold uppercase tracking-widest mb-1">Quote Management</p>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-indigo-600" />
            Quote for {quote.customer_name}
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* MAIN DETAILS CARD */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-wider text-zinc-400 mb-6 flex items-center gap-2">
                <User className="w-4 h-4" /> Customer Information
              </h2>
              
              <div className="grid grid-cols-1 gap-8">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Full Name</p>
                    <p className="text-lg font-bold text-zinc-900">{quote.customer_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Email Address</p>
                    <p className="text-lg font-bold text-zinc-900">{quote.customer_email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* HISTORY SECTION */}
            <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-wider text-zinc-400 mb-6 flex items-center gap-2">
                <History className="w-4 h-4" /> Activity History
              </h2>

              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[19px] before:w-0.5 before:bg-zinc-100">
                <div className="relative flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-110">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex-1">
                    <p className="text-sm font-bold text-zinc-900">Quote created</p>
                    <p className="text-xs text-zinc-400">Initial quote sent to customer</p>
                  </div>
                </div>

                {quote.status === "accepted" && (
                  <div className="relative flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-orange-500 flex items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-110">
                      <CheckCircle2 className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 flex-1">
                      <p className="text-sm font-bold text-orange-900">Accepted by customer</p>
                      <p className="text-xs text-orange-600/70">Awaiting payment or scheduling</p>
                    </div>
                  </div>
                )}

                {quote.status === "paid" && (
                  <div className="relative flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-110">
                      <IndianRupee className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex-1">
                      <p className="text-sm font-bold text-emerald-900">Payment received</p>
                      <p className="text-xs text-emerald-600/70">Transaction completed successfully</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR SUMMARY CARD */}
          <div className="space-y-6">
            <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-200 mb-2">Total Amount</p>
              <h3 className="text-4xl font-black tracking-tighter mb-6 flex items-center gap-1">
                <span className="text-2xl opacity-70 italic font-medium">₹</span>
                {quote.amount?.toLocaleString()}
              </h3>
              
              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-indigo-200">Payment Status</span>
                  <span className="font-bold">{quote.status === 'paid' ? 'Completed' : 'Pending'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-indigo-200">Created</span>
                  <span className="font-bold">{new Date(quote.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Quick Actions</h3>
              <div className="grid gap-3">
                <button className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-all active:scale-95 shadow-sm">
                  Edit Quote
                </button>
                <button className="w-full py-3 bg-white border border-zinc-200 text-zinc-600 rounded-xl font-bold text-sm hover:bg-zinc-50 transition-all active:scale-95">
                  Resend Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}