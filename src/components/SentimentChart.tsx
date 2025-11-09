import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import useSentimentData from '../hooks/useSentimentData'

function formatTime(ts: number) {
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function SentimentChart() {
  const { points } = useSentimentData()

  // data already aggregated per-minute by the hook; show only HH:MM as label
  const data = points.map((p) => ({ time: formatTime(p.time), score: Number(p.score.toFixed(3)) }))

  return (
    <div style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis
            dataKey="time"
            tick={{ fill: 'currentColor' }}
            // show fewer ticks when there are many minutes
            interval={Math.max(0, Math.floor(data.length / 6))}
          />
          <YAxis domain={[-1, 1]} tick={{ fill: 'currentColor' }} />
          <Tooltip />
          <Line type="linear" dataKey="score" stroke="#ec4899" dot={{ r: 2 }} strokeWidth={2} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
