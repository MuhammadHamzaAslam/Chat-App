import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">ChatApp</h1>
          <h2 className="text-xl font-semibold text-slate-300">{title}</h2>
          {subtitle && (
            <p className="text-sm text-slate-400 mt-2">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
