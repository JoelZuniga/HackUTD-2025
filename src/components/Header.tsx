import React from 'react'

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">T-Mobile Customer Sentiment Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Real-time insights on customer sentiment</p>
      </div>
      <div className="hidden sm:flex items-center space-x-3">
        <button className="px-3 py-1 rounded bg-pink-600 text-white text-sm">Dark</button>
      </div>
    </header>
  )
}
