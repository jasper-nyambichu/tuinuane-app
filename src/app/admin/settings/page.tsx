import { createServerSupabaseClient } from '../../../lib/supabase-server'
import { redirect } from 'next/navigation'

import AdminSettingsForm from 'components/admin/AdminSettingsForm'

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your admin account</p>
      </div>
      <AdminSettingsForm profile={profile} email={session.user.email ?? ''} />
    </div>
  )
}