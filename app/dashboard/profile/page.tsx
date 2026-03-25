"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Profile() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>({})
  const [originalProfile, setOriginalProfile] = useState<any>({})
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setUser(user)

    const { data: profileData } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()

    const { data: quotesData } = await supabase
      .from("quotes")
      .select("*")
      .eq("user_id", user.id)

    setProfile(profileData || {})
    setOriginalProfile(profileData || {})
    setQuotes(quotesData || [])
    setLoading(false)
  }

  async function handleSave() {
    const { error } = await supabase
      .from("users")
      .update({
        name: profile.name,
        business_name: profile.business_name,
      })
      .eq("id", user.id)

    if (!error) {
      setEditing(false)
      setOriginalProfile(profile)
      setMessage("Saved successfully")
    }
  }

  function handleCancel() {
    setProfile(originalProfile)
    setEditing(false)
  }

  const totalQuotes = quotes.length
  const revenue = quotes
    .filter(q => q.status === "paid")
    .reduce((sum, q) => sum + (q.amount || 0), 0)

  if (loading) return <div className="p-10 text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-6">

      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-4 text-sm text-blue-400 hover:underline"
      >
        ← Back to Dashboard
      </button>

      <div className="max-w-2xl mx-auto space-y-6">

        {/* 🔥 HEADER */}
        <div className="bg-gradient-to-r from-blue-600/20 to-transparent border border-blue-500/20 rounded-2xl p-6">
          <h1 className="text-2xl font-semibold">
            {profile.name || "Your Profile"}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {user.email}
          </p>
        </div>

        {/* 🔥 PROFILE DETAILS */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">

          <div className="flex justify-between items-center">
            <h2 className="font-medium">Account Details</h2>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="text-blue-500 text-sm"
              >
                Edit
              </button>
            ) : (
              <div className="flex gap-3 text-sm">
                <button onClick={handleCancel} className="text-gray-400">
                  Cancel
                </button>
                <button onClick={handleSave} className="text-blue-500">
                  Save
                </button>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Full Name</p>
            <input
              disabled={!editing}
              value={profile.name || ""}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 outline-none disabled:opacity-60"
            />
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Business Name</p>
            <input
              disabled={!editing}
              value={profile.business_name || ""}
              onChange={(e) =>
                setProfile({ ...profile, business_name: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 outline-none disabled:opacity-60"
            />
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Email</p>
            <input
              value={user.email}
              disabled
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 opacity-60"
            />
          </div>

          {message && (
            <p className="text-sm text-green-400 text-center">
              {message}
            </p>
          )}

        </div>

        {/* 🔥 ACCOUNT SUMMARY */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

          <h2 className="font-medium mb-4">Account Summary</h2>

          <div className="grid grid-cols-2 gap-4 text-center">

            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-xl font-semibold">{totalQuotes}</p>
              <p className="text-gray-400 text-sm">Quotes</p>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-xl font-semibold">₹{revenue}</p>
              <p className="text-gray-400 text-sm">Revenue</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}