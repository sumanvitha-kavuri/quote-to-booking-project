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
  History,
  MoreHorizontal,
  ExternalLink
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
        <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-zinc-200 rounded-full" />
            Loading Quote Details...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 pb-20">
      {/* HEADER BAR */}
      <div className="bg-white/80 backdrop-blur-md border-b border-zinc-200 px-8 py-5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-zinc-500 hover:text-indigo-600 transition-all font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Pipeline
          </button>
          
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-zinc-200 mx-1" />
            <span className={`text-[11px] px-4 py-1.5 rounded-full font-black uppercase tracking-wider border shadow-sm
              ${quote.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                quote.status === 'accepted' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                'bg-zinc-50 text-zinc-500 border-zinc-200'}`}>
              {quote.status?.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-8 lg:p-12 space-y-10">
        {/* TITLE SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-indigo-600 text-[11px] font-black uppercase tracking-[0.2em] mb-2">Quote Reference: #{quote.id?.slice(0,8)}</p>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight leading-none">
              {quote.customer_name}
            </h1>
          </div>
          <button className="flex items-center gap-2 bg-white border border-zinc-200 px-5 py-2.5 rounded-xl text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-all shadow-sm">
            <ExternalLink className="w-4 h-4" />
            View Public Link
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* INFO GRID */}
            <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
               {/* Subtle background decoration */}
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <User size={120} />
               </div>

              <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-8 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" /> Customer Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Full Name</p>
                    <p className="text-xl font-bold text-zinc-900">{quote.customer_name}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Contact Email</p>
                    <p className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                        {quote.customer_email}
                        <Mail className="w-4 h-4 text-zinc-300" />
                    </p>
                </div>
              </div>
            </div>

            {/* ACTIVITY TIMELINE */}
            <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-10 shadow-sm">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-10 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-500" /> Activity History
              </h2>

              <div className="space-y-10 relative before:absolute before:inset-0 before:ml-[23px] before:w-[2px] before:bg-zinc-100">
                {/* Event 1 */}
                <div className="relative flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-white border-2 border-zinc-100 flex items-center justify-center z-10 shadow-sm transition-all group-hover:border-indigo-600 group-hover:bg-indigo-50/30">
                    <Calendar className="w-5 h-5 text-zinc-400 group-hover:text-indigo-600" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-base font-bold text-zinc-900">Quote Drafted & Sent</p>
                        <span className="text-[10px] font-bold text-zinc-400">{new Date(quote.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-zinc-500 font-medium leading-relaxed">System automatically generated quote and emailed PDF to customer.</p>
                  </div>
                </div>

                {/* Event 2 (Conditional) */}
                {quote.status === "accepted" || quote.status === "paid" && (
                  <div className="relative flex items-start gap-6 group">
                    <div className="w-12 h-12 rounded-2xl bg-white border-2 border-orange-500 flex items-center justify-center z-10 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1 pt-1">
                       <div className="flex justify-between items-center mb-1">
                            <p className="text-base font-bold text-zinc-900">Quote Accepted</p>
                            <span className="text-[10px] font-bold text-zinc-400">2 days later</span>
                       </div>
                       <p className="text-sm text-zinc-500 font-medium leading-relaxed">Customer approved the pricing and terms online.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR SUMMARY */}
          <div className="space-y-6">
            <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-200/50 relative overflow-hidden group">
              {/* Decorative Circle */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-200/80 mb-3">Total Pipeline Value</p>
              <h3 className="text-5xl font-black tracking-tighter mb-8 flex items-center gap-1">
                <span className="text-2xl opacity-40 font-medium">₹</span>
                {quote.amount?.toLocaleString()}
              </h3>
              
              <div className="pt-8 border-t border-white/10 space-y-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-indigo-200 font-bold uppercase tracking-wider">Status</span>
                  <span className="font-black bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                    {quote.status === 'paid' ? 'SETTLED' : 'WAITING'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-indigo-200 font-bold uppercase tracking-wider">Tax (Inc)</span>
                  <span className="font-black">₹{(quote.amount * 0.18).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-6">Management Actions</h3>
              <div className="grid gap-3">
                <button className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-200">
                  Update Settings
                </button>
                <button className="w-full py-4 bg-white border border-zinc-200 text-zinc-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all active:scale-95">
                  Download PDF
                </button>
                <button className="w-full py-4 mt-2 text-rose-500 font-black text-xs uppercase tracking-widest hover:bg-rose-50 rounded-2xl transition-all">
                  Delete Permanent
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}