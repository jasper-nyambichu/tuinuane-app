import { requireAdmin } from '../../../../lib/auth'
import LeadsTable from '../../../../components/admin/LeadsTable'

export default async function LeadsPage() {
  const { supabase } = await requireAdmin()

  const { data: leads } = await supabase
    .from('leads').select('*').order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-0.5">All contact form submissions</p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
          {leads?.length ?? 0} total
        </div>
      </div>
      <LeadsTable leads={leads ?? []} />
    </div>
  )
}