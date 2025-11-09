import React from 'react'
import Header from './components/Header'
import SummaryCards from './components/SummaryCards'
import SentimentChart from './components/SentimentChart'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        <Header />

        <main className="mt-6">
          <SummaryCards />

          <section className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Live Sentiment</h2>
            <SentimentChart />
          </section>

          <section className="mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-md font-semibold">Backend connection coming soon</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">This app currently uses a local mock data source. Replace the hook in <code className="px-1 rounded bg-gray-100 dark:bg-gray-700">src/hooks/useSentimentData.ts</code> to connect a real backend.</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
