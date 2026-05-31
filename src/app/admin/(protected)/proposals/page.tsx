import { requireAdmin } from '../../../../lib/auth'
import QuotesTable from '../../../../components/admin/QuotesTable'

export default async function ProposalsPage() {
  const { supabase } = await requireAdmin()

  const { data: quotes } = await supabase
    .from('quotes').select('*').order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl text-gray-900">Proposals</h1>
          <p className="text-sm text-gray-500 mt-0.5">All quote requests and proposals</p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
          {quotes?.length ?? 0} total
        </div>
      </div>
      <QuotesTable quotes={quotes ?? []} />
    </div>
  )
}