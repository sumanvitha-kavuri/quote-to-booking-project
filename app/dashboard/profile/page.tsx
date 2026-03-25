"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>({})
  const [originalProfile, setOriginalProfile] = useState<any>({})
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
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
    setSaving(true)
    setMessage("")

    const { error } = await supabase
      .from("users")
      .update({
        name: profile.name,
        business_name: profile.business_name,
      })
      .eq("id", user.id)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("Profile updated successfully")
      setEditing(false)
      setOriginalProfile(profile)
    }

    setSaving(false)
  }

  function handleCancel() {
    setProfile(originalProfile)
    setEditing(false)
  }

  // 🔥 STATS (unique section)
  const totalQuotes = quotes.length
  const revenue = quotes
    .filter(q => q.status === "paid")
    .reduce((sum, q) => sum + (q.amount || 0), 0)

  if (loading) {
    return <div className="p-10 text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-6">

      <div className="max-w-xl mx-auto space-y-6">

        {/* PROFILE CARD */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">

          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Profile</h1>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="text-blue-500 text-sm"
              >
                Edit
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="text-gray-400 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="text-blue-500 text-sm"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          {/* NAME */}
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

          {/* BUSINESS */}
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

          {/* EMAIL */}
          <div>
            <p className="text-sm text-gray-400 mb-1">Email</p>
            <input
              value={user?.email}
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

        {/* 🔥 UNIQUE: ACCOUNT SUMMARY */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

          <h2 className="text-lg font-medium mb-4">
            Account Summary
          </h2>

          <div className="grid grid-cols-2 gap-4 text-center">

            <div>
              <p className="text-xl font-semibold">{totalQuotes}</p>
              <p className="text-gray-400 text-sm">Total Quotes</p>
            </div>

            <div>
              <p className="text-xl font-semibold">₹{revenue}</p>
              <p className="text-gray-400 text-sm">Total Revenue</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}