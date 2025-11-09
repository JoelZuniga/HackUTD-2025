import React from 'react'
import T_logo from "../assets/T-Digit-logo.png";

export default function Header() {
  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-4">
          <a href="https://www.t-mobile.com" target="_blank" rel="noopener noreferrer">
            <img src={T_logo} alt="T-Mobile Logo" className="h-14 w-auto"/>
          </a>
          <div className ="flex flex-col leading-tight">
            <h1 className="text-2xl font-bold">T-Mobile Customer Sentiment Dashboard</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Real-time insights on customer sentiment</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-3"></div>
      </div>
      <div className="hidden sm:flex items-center space-x-3"></div>
    </header>
  )
}
