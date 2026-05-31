import { createServerSupabaseClient } from '../../../../lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import DashboardCharts from '../../../../components/admin/DashboardCharts'
import { requireAdmin } from '../../../../lib/auth'

export default async function DashboardPage() {
  const { supabase } = await requireAdmin()

  const [
    { count: leadsCount },
    { count: quotesCount },
    { count: newLeadsCount },
    { count: pendingQuotesCount },
    { count: convertedCount },
  ] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('quotes').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('quotes').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'converted'),
  ])

  const { data: recentLeads } = await supabase
    .from('leads').select('*').order('created_at', { ascending: false }).limit(5)

  const { data: recentQuotes } = await supabase
    .from('quotes').select('*').order('created_at', { ascending: false }).limit(5)

  const conversionRate = leadsCount && leadsCount > 0
    ? Math.round(((convertedCount ?? 0) / leadsCount) * 100)
    : 0

  const kpis = [
    {
      label: 'Total Leads',
      value: leadsCount ?? 0,
      delta: '+12%',
      positive: true,
      href: '/admin/leads',
      emphasized: true,
    },
    {
      label: 'Quote Requests',
      value: quotesCount ?? 0,
      delta: '+8%',
      positive: true,
      href: '/admin/proposals',
      emphasized: false,
    },
    {
      label: 'New Leads',
      value: newLeadsCount ?? 0,
      delta: '+5%',
      positive: true,
      href: '/admin/leads',
      emphasized: false,
    },
    {
      label: 'Pending Quotes',
      value: pendingQuotesCount ?? 0,
      delta: '-2%',
      positive: false,
      href: '/admin/proposals',
      emphasized: false,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Plan, prioritize, and accomplish your tasks with ease.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/leads"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition-all shadow-sm shadow-emerald-200">
            + Add Lead
          </Link>
          <Link href="/admin/proposals"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
            Import Data
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Link key={kpi.label} href={kpi.href}
            className={`relative rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-md ${
              kpi.emphasized
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
                : 'bg-white border border-gray-100 shadow-sm'
            }`}>
            <div className="flex items-start justify-between mb-4">
              <p className={`text-sm font-medium ${kpi.emphasized ? 'text-emerald-100' : 'text-gray-500'}`}>
                {kpi.label}
              </p>
              <div className={`flex h-7 w-7 items-center justify-center rounded-full ${
                kpi.emphasized ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                <ArrowUpRight className={`h-3.5 w-3.5 ${kpi.emphasized ? 'text-white' : 'text-gray-600'}`} />
              </div>
            </div>
            <p className={`font-bold text-3xl mb-2 ${kpi.emphasized ? 'text-white' : 'text-gray-900'}`}>
              {kpi.value}
            </p>
            <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              kpi.emphasized
                ? 'bg-white/20 text-white'
                : kpi.positive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-600'
            }`}>
              {kpi.delta} from last month
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <DashboardCharts conversionRate={conversionRate} />

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h2 className="font-semibold text-gray-900">Recent Leads</h2>
              <p className="text-xs text-gray-400">Latest contact form submissions</p>
            </div>
            <Link href="/admin/leads"
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentLeads?.length === 0 && (
              <p className="text-sm text-gray-400 px-5 py-8 text-center">No leads yet</p>
            )}
            {recentLeads?.map((lead) => (
              <div key={lead.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">
                    {lead.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{lead.name}</p>
                  <p className="text-xs text-gray-400 truncate">{lead.message.substring(0, 40)}...</p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  lead.status === 'new' ? 'bg-emerald-50 text-emerald-700' :
                  lead.status === 'contacted' ? 'bg-blue-50 text-blue-700' :
                  lead.status === 'converted' ? 'bg-purple-50 text-purple-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quotes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h2 className="font-semibold text-gray-900">Quote Requests</h2>
              <p className="text-xs text-gray-400">Latest proposal requests</p>
            </div>
            <Link href="/admin/proposals"
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentQuotes?.length === 0 && (
              <p className="text-sm text-gray-400 px-5 py-8 text-center">No quotes yet</p>
            )}
            {recentQuotes?.map((quote) => (
              <div key={quote.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">
                    {quote.business_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{quote.business_name}</p>
                  <p className="text-xs text-gray-400 truncate">{quote.product_interest}</p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  quote.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                  quote.status === 'proposal_sent' ? 'bg-blue-50 text-blue-700' :
                  quote.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  {quote.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}