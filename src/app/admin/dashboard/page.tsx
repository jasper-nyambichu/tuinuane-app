import { createServerSupabaseClient } from '../../../lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, FileText, Clock, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/admin/login')

  const [
    { count: leadsCount },
    { count: quotesCount },
    { count: newLeadsCount },
    { count: pendingQuotesCount },
  ] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('quotes').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('quotes').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  const { data: recentLeads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: recentQuotes } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Total Leads', value: leadsCount ?? 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', href: '/admin/leads' },
    { label: 'Total Quotes', value: quotesCount ?? 0, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50', href: '/admin/proposals' },
    { label: 'New Leads', value: newLeadsCount ?? 0, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50', href: '/admin/leads' },
    { label: 'Pending Quotes', value: pendingQuotesCount ?? 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', href: '/admin/proposals' },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back — here is what is happening today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-elegant transition-all hover:border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="font-display font-bold text-3xl">{stat.value}</p>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-display font-bold text-base">Recent Leads</h2>
            <Link href="/admin/leads" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border">
            {recentLeads?.length === 0 && (
              <p className="text-sm text-muted-foreground px-6 py-4">No leads yet</p>
            )}
            {recentLeads?.map((lead) => (
              <div key={lead.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">{lead.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    lead.status === 'new' ? 'bg-green-50 text-green-600' :
                    lead.status === 'contacted' ? 'bg-blue-50 text-blue-600' :
                    lead.status === 'converted' ? 'bg-purple-50 text-purple-600' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    {lead.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(lead.created_at).toLocaleDateString('en-KE')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quotes */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-display font-bold text-base">Recent Quote Requests</h2>
            <Link href="/admin/proposals" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border">
            {recentQuotes?.length === 0 && (
              <p className="text-sm text-muted-foreground px-6 py-4">No quotes yet</p>
            )}
            {recentQuotes?.map((quote) => (
              <div key={quote.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{quote.business_name}</p>
                  <p className="text-xs text-muted-foreground">{quote.product_interest}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    quote.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                    quote.status === 'proposal_sent' ? 'bg-blue-50 text-blue-600' :
                    quote.status === 'approved' ? 'bg-green-50 text-green-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {quote.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(quote.created_at).toLocaleDateString('en-KE')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}