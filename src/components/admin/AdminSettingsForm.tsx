'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

type Profile = {
  full_name: string | null
  role: string | null
} | null

export default function AdminSettingsForm({ profile, email }: { profile: Profile, email: string }) {
  const router = useRouter()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('admin_profiles').update({ full_name: fullName }).eq('id', user.id)
    }
    setMessage('Profile updated successfully')
    setLoading(false)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-display font-bold text-base mb-6">Profile Information</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Full Name</label>
            <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Email Address</label>
            <Input value={email} disabled className="opacity-60" />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed here</p>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Role</label>
            <Input value={profile?.role ?? 'admin'} disabled className="opacity-60" />
          </div>
          {message && <p className="text-sm text-green-600">{message}</p>}
          <Button type="submit" disabled={loading} className="rounded-xl">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-card border border-destructive/20 rounded-2xl p-6">
        <h2 className="font-display font-bold text-base mb-2 text-destructive">Session</h2>
        <p className="text-sm text-muted-foreground mb-4">Sign out of your admin account</p>
        <Button variant="outline" onClick={handleLogout}
          className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10">
          Sign Out
        </Button>
      </div>
    </div>
  )
}