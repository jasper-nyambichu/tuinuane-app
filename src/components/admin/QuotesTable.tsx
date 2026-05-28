'use client'

import { useState } from 'react'
import { Button } from '../ui/button'

type Quote = {
  id: string
  name: string
  email: string
  phone: string
  business_name: string
  product_interest: string
  description: string
  status: string
  proposal_text: string | null
  notes: string | null
  created_at: string
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-600',
  proposal_sent: 'bg-blue-50 text-blue-600',
  approved: 'bg-green-50 text-green-600',
  rejected: 'bg-red-50 text-red-600',
}

export default function QuotesTable({ quotes }: { quotes: Quote[] }) {
  const [selected, setSelected] = useState<Quote | null>(null)
  const [status, setStatus] = useState('')
  const [proposalText, setProposalText] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [localQuotes, setLocalQuotes] = useState(quotes)

  const openQuote = (quote: Quote) => {
    setSelected(quote)
    setStatus(quote.status)
    setProposalText(quote.proposal_text ?? '')
    setNotes(quote.notes ?? '')
  }

  const handleUpdate = async () => {
    if (!selected) return
    setLoading(true)
    const res = await fetch(`/api/quotes/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, proposalText, notes }),
    })
    const { data } = await res.json()
    setLocalQuotes(prev => prev.map(q => q.id === data.id ? data : q))
    setSelected(null)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this quote request?')) return
    await fetch(`/api/quotes/${id}`, { method: 'DELETE' })
    setLocalQuotes(prev => prev.filter(q => q.id !== id))
    setSelected(null)
  }

  return (
    <>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {localQuotes.length === 0 ? (
          <p className="text-sm text-muted-foreground p-8 text-center">No quote requests yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Business</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Product</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {localQuotes.map((quote) => (
                <tr key={quote.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{quote.business_name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{quote.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{quote.product_interest}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[quote.status] ?? 'bg-gray-50 text-gray-600'}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {new Date(quote.created_at).toLocaleDateString('en-KE')}
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline" className="rounded-lg h-7 text-xs" onClick={() => openQuote(quote)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quote Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl border border-border w-full max-w-lg p-6 shadow-premium max-h-[90vh] overflow-y-auto">
            <h2 className="font-display font-bold text-lg mb-1">{selected.business_name}</h2>
            <p className="text-sm text-muted-foreground mb-1">{selected.name} · {selected.email}</p>
            <p className="text-xs text-primary font-medium mb-6">{selected.product_interest}</p>

            <div className="bg-muted/40 rounded-xl p-4 mb-5">
              <p className="text-xs font-medium text-muted-foreground mb-1">Project Description</p>
              <p className="text-sm">{selected.description}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-medium block mb-1.5">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background"
                >
                  <option value="pending">Pending</option>
                  <option value="proposal_sent">Proposal Sent</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5">Proposal Text</label>
                <textarea
                  value={proposalText}
                  onChange={e => setProposalText(e.target.value)}
                  rows={4}
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background resize-none"
                  placeholder="Write your proposal here..."
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5">Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background resize-none"
                  placeholder="Internal notes..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={handleUpdate} disabled={loading} className="flex-1 rounded-xl">
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={() => setSelected(null)} className="rounded-xl">
                Cancel
              </Button>
              <Button variant="outline" onClick={() => handleDelete(selected.id)}
                className="rounded-xl text-destructive hover:bg-destructive/10 border-destructive/30">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}