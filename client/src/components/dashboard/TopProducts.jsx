import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import Card from '../ui/Card'
import Skeleton from '../ui/Skeleton'

export default function TopProducts({ data, loading }) {
  return (
    <Card>
      <h3 className='text-sm font-semibold text-gray-900 mb-4'>Top Products</h3>

      {loading ? (
        <Skeleton height='h-64' />
      ) : (
        <ResponsiveContainer width='100%' height={260}>
          <BarChart
            data={data}
            layout='vertical'
            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' horizontal={false} />
            <XAxis
              type='number'
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <YAxis
              type='category'
              dataKey='name'
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              width={90}
            />
            <Tooltip
              formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '12px',
              }}
            />
            <Bar dataKey='revenue' fill='#818cf8' radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}