import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import Card from '../ui/Card'
import Skeleton from '../ui/Skeleton'

const ranges = ['daily', 'weekly', 'monthly']

export default function RevenueChart({ data, loading, onRangeChange }) {
  const [activeRange, setActiveRange] = useState('daily')

  const handleRange = (range) => {
    setActiveRange(range)
    onRangeChange(range)
  }

  return (
    <Card>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-sm font-semibold text-gray-900'>Revenue Overview</h3>
        <div className='flex gap-1 bg-gray-100 rounded-lg p-1'>
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => handleRange(r)}
              className={`px-3 py-1 text-xs rounded-md capitalize transition-all ${
                activeRange === r
                  ? 'bg-white text-indigo-600 font-medium shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Skeleton height='h-64' />
      ) : (
        <ResponsiveContainer width='100%' height={260}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
            <XAxis
              dataKey='label'
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '12px',
              }}
            />
            <Line
              type='monotone'
              dataKey='revenue'
              stroke='#6366f1'
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}