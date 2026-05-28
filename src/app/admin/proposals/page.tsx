import { createServerSupabaseClient } from '../../../lib/supabase-server'
import { redirect } from 'next/navigation'
import QuotesTable from 'components/admin/QuotesTable'

export default async function ProposalsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/admin/login')

  const { data: quotes } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl">Proposals</h1>
        <p className="text-sm text-muted-foreground mt-1">All quote requests and proposals</p>
      </div>
      <QuotesTable quotes={quotes ?? []} />
    </div>
  )
}