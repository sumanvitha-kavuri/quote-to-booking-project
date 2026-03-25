"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setUser(user)

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()

    setProfile(data || {})
    setLoading(false)
  }

  // ✅ SAVE PROFILE
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
    }

    setSaving(false)
  }

  // ✅ IMAGE UPLOAD
  async function handleImageUpload(e: any) {
    const file = e.target.files[0]
    if (!file) return

    const filePath = `${user.id}-${Date.now()}`

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file)

    if (error) {
      setMessage(error.message)
      return
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath)

    const imageUrl = data.publicUrl

    await supabase
      .from("users")
      .update({ avatar_url: imageUrl })
      .eq("id", user.id)

    setProfile({ ...profile, avatar_url: imageUrl })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] text-gray-400">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-6">

      <div className="max-w-xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">

        <h1 className="text-2xl font-semibold text-center">
          Your Profile
        </h1>

        {/* IMAGE */}
        <div className="flex flex-col items-center gap-3">

          <img
            src={profile.avatar_url || "https://via.placeholder.com/100"}
            className="w-24 h-24 rounded-full object-cover border border-white/10"
          />

          <input
            type="file"
            onChange={handleImageUpload}
            className="text-sm"
          />

        </div>

        {/* NAME */}
        <div>
          <p className="text-sm text-gray-400 mb-1">Full Name</p>
          <input
            value={profile.name || ""}
            onChange={(e) =>
              setProfile({ ...profile, name: e.target.value })
            }
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 outline-none"
          />
        </div>

        {/* BUSINESS */}
        <div>
          <p className="text-sm text-gray-400 mb-1">Business Name</p>
          <input
            value={profile.business_name || ""}
            onChange={(e) =>
              setProfile({ ...profile, business_name: e.target.value })
            }
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 outline-none"
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

        {/* MESSAGE */}
        {message && (
          <p className="text-sm text-center text-green-400">
            {message}
          </p>
        )}

        {/* SAVE */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 py-3 rounded-lg font-medium hover:bg-blue-500 transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>

    </div>
  )
}