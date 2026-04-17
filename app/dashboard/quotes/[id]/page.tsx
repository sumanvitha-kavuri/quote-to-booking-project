/**
 * QUOTE DETAIL PAGE
 * Functionality: 
 * - Macro-view of a single customer's quote status.
 * - Real-time activity timeline tracking.
 * - Quick action triggers (Edit, Resend, Status management).
 */

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
  MoreHorizontal
} from "lucide-react"

export default function QuoteDetail() {
  const { id } = useParams()
  const router = useRouter()
  
  // State management for quote data
  const [quote, setQuote] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuote()
  }, [])

  /**
   * Fetch specific quote data from Supabase
   */
  async function fetchQuote() {
    try {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .eq("id", id)
        .single()

      if (error) throw error
      setQuote(data)
    } catch (err) {
      console.error("Error fetching quote:", err)
    } finally {
      setLoading(false)
    }
  }

  // Loading State - Matches Dashboard Aesthetic
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 text-zinc-400 font-medium animate-pulse">
        Loading Details...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 pb-20">
      
      {/* 1. STICKY HEADER BAR */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-zinc-200 px-8 py-5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-zinc-500 hover:text-indigo-600 transition-all font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-4">
            {/* Dynamic Status Badge */}
            <span className={`text-[11px] px-4 py-1.5 rounded-full font-black uppercase tracking-wider border shadow-sm
              ${quote.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                quote.status === 'accepted' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                'bg-zinc-50 text-zinc-500 border-zinc-200'}`}>
              {quote.status?.replace('_', ' ')}
            </span>
            <button className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8 lg:p-12 space-y-10">
        
        {/* 2. PAGE TITLE SECTION */}
        <header>
          <p className="text-indigo-600 text-[11px] font-black uppercase tracking-[0.2em] mb-2">Management View</p>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight leading-tight">
            Quote for {quote.customer_name}
          </h1>
        </header>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* 3. PRIMARY CONTENT (Left Column) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Customer Details Card */}
            <section className="bg-white border border-zinc-200 rounded-[2.5rem] p-10 shadow-sm">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-8 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" /> Customer Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Full Name</p>
                  <p className="text-xl font-bold text-zinc-900">{quote.customer_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Email Address</p>
                  <p className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                    {quote.customer_email}
                    <Mail className="w-4 h-4 text-zinc-300" />
                  </p>
                </div>
              </div>
            </section>

            {/* Visual Activity History */}
            <section className="bg-white border border-zinc-200 rounded-[2.5rem] p-10 shadow-sm">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-10 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-500" /> Activity History
              </h2>

              <div className="space-y-10 relative before:absolute before:inset-0 before:ml-[23px] before:w-[2px] before:bg-zinc-100">
                
                {/* Event: Creation */}
                <div className="relative flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-white border-2 border-zinc-100 flex items-center justify-center z-10 shadow-sm transition-all group-hover:border-indigo-600 group-hover:bg-indigo-50/30">
                    <Calendar className="w-5 h-5 text-zinc-400 group-hover:text-indigo-600" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-base font-bold text-zinc-900">Quote created</p>
                    <p className="text-sm text-zinc-500 font-medium">Draft sent to {quote.customer_email}</p>
                  </div>
                </div>

                {/* Event: Acceptance (Conditional) */}
                {quote.status === "accepted" && (
                  <div className="relative flex items-start gap-6 group">
                    <div className="w-12 h-12 rounded-2xl bg-white border-2 border-orange-500 flex items-center justify-center z-10 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-base font-bold text-zinc-900">Accepted by customer</p>
                      <p className="text-sm text-zinc-500 font-medium">Awaiting final payment or scheduling</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* 4. SIDEBAR SUMMARY (Right Column) */}
          <aside className="space-y-6">
            
            {/* Pricing Highlight Card */}
            <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-200/50 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-200/80 mb-3">Amount Due</p>
              <h3 className="text-5xl font-black tracking-tighter mb-8 flex items-center gap-1">
                <span className="text-2xl opacity-40 font-medium italic">₹</span>
                {quote.amount?.toLocaleString()}
              </h3>
              
              <div className="pt-8 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-indigo-200 uppercase tracking-widest">Payment</span>
                  <span className="bg-white/20 px-3 py-1 rounded-lg">{quote.status === 'paid' ? 'COMPLETED' : 'PENDING'}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-6">Quick Actions</h3>
              <div className="grid gap-3">
                <button className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-200">
                  Edit Quote
                </button>
                <button className="w-full py-4 bg-white border border-zinc-200 text-zinc-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all active:scale-95">
                  Resend Link
                </button>
              </div>
            </div>
            
          </aside>
        </div>
      </main>
    </div>
  )
}