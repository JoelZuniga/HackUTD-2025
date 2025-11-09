import React from 'react'
import useSentimentData from '../hooks/useSentimentData'

function Card({ title, value, children }: { title: string; value: string; children?: React.ReactNode }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex-1">
      <div className="text-sm text-gray-500 dark:text-gray-300">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {children}
    </div>
  )
}

export default function SummaryCards() {
  const { avg, positivePct, negativePct } = useSentimentData()

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card title="Avg Sentiment" value={avg.toFixed(2)} />
      <Card title="Positive %" value={`${positivePct.toFixed(0)}%`} />
      <Card title="Negative %" value={`${negativePct.toFixed(0)}%`} />
    </section>
  )
}
