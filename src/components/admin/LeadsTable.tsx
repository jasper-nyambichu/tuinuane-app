'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { CheckCircle, Trash2, X } from 'lucide-react'

type Lead = {
  id: string
  name: string
  email: string
  phone: string
  message: string
  status: string
  notes: string | null
  created_at: string
}

const statusColors: Record<string, string> = {
  new: 'bg-green-50 text-green-600',
  contacted: 'bg-blue-50 text-blue-600',
  converted: 'bg-purple-50 text-purple-600',
  closed: 'bg-gray-50 text-gray-600',
}

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [selected, setSelected] = useState<Lead | null>(null)
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [localLeads, setLocalLeads] = useState(leads)

  const openLead = (lead: Lead) => {
    setSelected(lead)
    setStatus(lead.status)
    setNotes(lead.notes ?? '')
  }

  const handleUpdate = async () => {
    if (!selected) return
    setLoading(true)
    try {
      const res = await fetch(`/api/leads/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      })
      const { data, error } = await res.json()
      if (error) throw new Error(error)
      setLocalLeads(prev => prev.map(l => l.id === data.id ? data : l))
      setSelected(null)
      toast.success('Lead updated successfully', {
        description: `${selected.name} status set to ${status}`,
      })
    } catch {
      toast.error('Failed to update lead', {
        description: 'Please try again',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const lead = localLeads.find(l => l.id === id)
    toast('Delete this lead?', {
      description: `This will permanently remove ${lead?.name}'s record.`,
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await fetch(`/api/leads/${id}`, { method: 'DELETE' })
            setLocalLeads(prev => prev.filter(l => l.id !== id))
            setSelected(null)
            toast.success('Lead deleted')
          } catch {
            toast.error('Failed to delete lead')
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    })
  }

  return (
    <>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {localLeads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3 text-xl">📥</div>
            <p className="text-sm font-medium mb-1">No leads yet</p>
            <p className="text-xs text-muted-foreground">Leads from your contact form will appear here</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Phone</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {localLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium">{lead.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{lead.email}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{lead.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[lead.status] ?? 'bg-gray-50 text-gray-600'}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {new Date(lead.created_at).toLocaleDateString('en-KE')}
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline" className="rounded-lg h-7 text-xs" onClick={() => openLead(lead)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-background rounded-2xl border border-border w-full max-w-lg shadow-premium animate-fade-in-up">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="font-display font-bold text-lg">{selected.name}</h2>
                <p className="text-sm text-muted-foreground">{selected.email} · {selected.phone}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-muted transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-muted/40 rounded-xl p-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Message</p>
                <p className="text-sm leading-relaxed">{selected.message}</p>
              </div>

              <div>
                <label className="text-xs font-medium block mb-1.5">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:border-primary/50"
                >
                  <option value="new">🟢 New</option>
                  <option value="contacted">🔵 Contacted</option>
                  <option value="converted">🟣 Converted</option>
                  <option value="closed">⚫ Closed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium block mb-1.5">Internal Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background resize-none focus:outline-none focus:border-primary/50"
                  placeholder="Add notes about this lead..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-6 border-t border-border">
              <Button onClick={handleUpdate} disabled={loading} className="flex-1 rounded-xl gap-2">
                <CheckCircle className="h-4 w-4" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={() => setSelected(null)} className="rounded-xl">
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDelete(selected.id)}
                className="rounded-xl text-destructive hover:bg-destructive/10 border-destructive/30 gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}