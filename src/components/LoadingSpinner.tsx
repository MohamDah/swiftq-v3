import { Loader2 } from 'lucide-react'
import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({
  size = 'md',
  color = 'text-primary',
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  }

  const spinner = (
    <Loader2
      className={`animate-spin mx-auto ${sizeClasses[size]} ${color}`}
      role="status"
      aria-label="Loading"
    />
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">{spinner}</div>
    )
  }

  return spinner
}
