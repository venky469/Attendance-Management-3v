'use client'

import { useEffect, useState } from 'react'

interface ModernLoaderProps {
  message?: string
  fullPage?: boolean
}

export function ModernLoader({ message = 'Loading...', fullPage = false }: ModernLoaderProps) {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const containerClass = fullPage
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-background'
    : 'flex items-center justify-center min-h-[400px] w-full'

  return (
    <div className={containerClass}>
      <div className="relative flex flex-col items-center gap-6 p-8">
        {/* Animated gradient circles background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr from-chart-5/20 via-chart-2/20 to-chart-1/20 rounded-full blur-2xl animate-pulse delay-75" />
        </div>

        {/* Main loader animation */}
        <div className="relative w-32 h-32">
          {/* Outer rotating ring with gradient */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-primary via-secondary to-accent bg-origin-border animate-spin" 
               style={{ maskImage: 'linear-gradient(transparent 50%, black 50%)', WebkitMaskImage: 'linear-gradient(transparent 50%, black 50%)' }} />
          
          {/* Middle pulsing circle */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-chart-1 via-chart-2 to-chart-5 opacity-20 animate-pulse" />
          
          {/* Inner rotating circle */}
          <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-primary border-r-secondary animate-spin" 
               style={{ animationDuration: '1.5s' }} />
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>

        {/* Loading dots animation */}
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-secondary to-accent animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-accent to-chart-5 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        {/* Message with gradient text */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {message}{dots}
          </h3>
          <p className="text-sm text-muted-foreground">Please wait while we load your data</p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary via-secondary to-accent animate-pulse" 
               style={{ 
                 width: '100%',
                 animation: 'shimmer 2s infinite',
               }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .delay-75 {
          animation-delay: 75ms;
        }
      `}</style>
    </div>
  )
}

export default ModernLoader
