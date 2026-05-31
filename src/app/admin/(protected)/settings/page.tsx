import { requireAdmin } from '../../../../lib/auth'
import AdminSettingsForm from '../../../../components/admin/AdminSettingsForm'

export default async function SettingsPage() {
  const { supabase, user } = await requireAdmin()

  const { data: profile } = await supabase
    .from('admin_profiles').select('*').eq('id', user.id).single()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-bold text-2xl text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your admin account</p>
      </div>
      <AdminSettingsForm profile={profile} email={user.email ?? ''} />
    </div>
  )
}