import React from 'react'

import { displayError } from '@/utils/displayError'

interface ErrorComponentProps {
  error?: Error
  title?: string
  message?: string
  onRetry?: () => void
  onGoBack?: () => void
  retryText?: string
  goBackText?: string
  fullScreen?: boolean
}

export default function ErrorComponent({
  error,
  title = 'Something went wrong',
  message,
  onRetry,
  onGoBack,
  retryText = 'Try Again',
  goBackText = 'Go Back',
  fullScreen = false,
}: ErrorComponentProps) {
  const errorMessage =
    message || (error && displayError(error)) || 'An unexpected error occurred. Please try again.'

  const content = (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-md w-full mx-auto">
      <div className="flex flex-col items-center text-center">
        {/* Error Icon */}
        <div className="rounded-full bg-red-100 p-3 mb-4">
          <svg
            className="h-12 w-12 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error Title */}
        <h2 className="text-xl font-bold text-red-600 mb-2">{title}</h2>

        {/* Error Message */}
        <p className="text-gray-600 mb-6">{errorMessage}</p>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full">
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 shadow-md shadow-black/25"
            >
              {goBackText}
            </button>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 px-4 py-2 bg-primary-sat font-semibold rounded-xl hover:bg-primary shadow-md shadow-black/25"
            >
              {retryText}
            </button>
          )}
        </div>
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">{content}</div>
    )
  }

  return content
}
