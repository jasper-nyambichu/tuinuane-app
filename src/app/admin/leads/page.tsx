import { createServerSupabaseClient } from '../../../lib/supabase-server'
import { redirect } from 'next/navigation'
import LeadsTable from '../../../components/admin/LeadsTable'

export default async function LeadsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/admin/login')

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl">Leads</h1>
        <p className="text-sm text-muted-foreground mt-1">All contact form submissions</p>
      </div>
      <LeadsTable leads={leads ?? []} />
    </div>
  )
}