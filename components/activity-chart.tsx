'use client'

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface ActivityChartProps {
  data?: Record<string, number>
}

export function ActivityChart({ data }: ActivityChartProps) {
  // Convert object to array format for Recharts
  const chartData = data
    ? Object.entries(data).map(([date, calls]) => ({
        date,
        calls,
      }))
    : []

  return (
    <div className="h-32 w-full" role="img" aria-label="Line chart of calls received over time">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="callsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.18} />
              <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
            interval={chartData.length > 7 ? Math.floor(chartData.length / 7) : 0}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
            allowDecimals={false}
            width={40}
          />
          <Tooltip
            cursor={{ stroke: 'var(--color-border)' }}
            contentStyle={{
              borderRadius: 12,
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-card-foreground)',
              fontSize: 12,
              boxShadow: '0 4px 16px rgb(0 0 0 / 0.06)',
            }}
            labelStyle={{ color: 'var(--color-muted-foreground)' }}
          />
          <Area
            type="monotone"
            dataKey="calls"
            stroke="var(--color-chart-1)"
            strokeWidth={2.5}
            fill="url(#callsFill)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
