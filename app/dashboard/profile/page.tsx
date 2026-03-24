"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState("")
  const [business, setBusiness] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.replace("/login")
      return
    }

    setUser(user)

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (data) {
      setName(data.name || "")
      setBusiness(data.business_name || "")
    }

    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)

    const { error } = await supabase
      .from("users")
      .update({
        name,
        business_name: business,
      })
      .eq("id", user.id)

    if (error) {
      alert("Error saving")
      setSaving(false)
      return
    }

    alert("Profile updated")
    setSaving(false)
  }

  if (loading) {
    return <p className="p-10">Loading...</p>
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Profile</h1>

        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.replace("/login")
          }}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Logout
        </button>
      </div>

      {/* CARD */}
      <div className="max-w-xl bg-white p-6 rounded-xl shadow border space-y-4">

        <div>
          <label className="text-sm text-gray-500">Full Name</label>
          <input
            className="w-full border p-2 rounded mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Business Name</label>
          <input
            className="w-full border p-2 rounded mt-1"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Email</label>
          <input
            className="w-full border p-2 rounded mt-1 bg-gray-100"
            value={user?.email}
            disabled
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg mt-4"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>

      {/* ACTIVITY */}
      <div className="mt-8 max-w-xl bg-white p-6 rounded-xl border">
        <h2 className="font-semibold mb-2">Activity</h2>
        <p className="text-sm text-gray-500">
          Last login: Just now
        </p>
      </div>

    </main>
  )
}