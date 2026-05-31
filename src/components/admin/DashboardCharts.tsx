'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const chartData = [
  { name: 'S', value: 3 },
  { name: 'M', value: 7 },
  { name: 'T', value: 5 },
  { name: 'W', value: 9 },
  { name: 'T', value: 4 },
  { name: 'F', value: 6 },
  { name: 'S', value: 2 },
]

export default function DashboardCharts({ conversionRate }: { conversionRate: number }) {
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (conversionRate / 100) * circumference

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Bar Chart */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-gray-900">Lead Analytics</h3>
            <p className="text-xs text-gray-400 mt-0.5">Weekly lead activity</p>
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
            {['Day', 'Week', 'Month'].map((r, i) => (
              <button key={r}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                  i === 1 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <div style={{ width: '100%', height: 192, minHeight: 0 }}>
         <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 6" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  fontSize: 12,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value) => {
                  const numberValue = typeof value === 'number' ? value : 0
                  return [numberValue, 'Leads']
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={32}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={i === 3 ? '#10b981' : '#d1fae5'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversion Ring */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">Conversion Rate</h3>
          <p className="text-xs text-gray-400 mt-0.5">Leads converted to clients</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative h-36 w-36">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#f0fdf4" strokeWidth="12" />
              <circle cx="60" cy="60" r="54" fill="none" stroke="#10b981"
                strokeWidth="12" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-bold text-2xl text-gray-900">{conversionRate}%</span>
              <span className="text-[10px] text-gray-400">Project Ended</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            {[
              { label: 'Converted', color: 'bg-emerald-500' },
              { label: 'In Progress', color: 'bg-emerald-200' },
              { label: 'Pending', color: 'bg-gray-200' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${item.color}`} />
                <span className="text-[10px] text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}