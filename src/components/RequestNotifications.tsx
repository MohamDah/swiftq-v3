import { useEffect, useState } from 'react'

import { useSubscribeNotifs } from '@/queries/mutations/useSubscribeNotifs'
import { notificationService } from '@/services/notificationService'
import { CustomerStatus } from '@/types/api'
import type { NotificationState } from '@/types/notifications'

export function RequestNotifications({ status }: { status: CustomerStatus }) {
  const { mutateAsync: subscribe, isPending: isSubscribing } = useSubscribeNotifs()
  const [notificationState, setNotificationState] = useState<NotificationState>(
    notificationService.getState(),
  )
  const [isInitializing, setIsInitializing] = useState(false)
  const [subscribed, setSubscribed] = useState(status.hasNotifications)

  // Subscribe to notification service state changes
  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setNotificationState)
    return unsubscribe
  }, [])

  // Update subscribed status when backend status changes
  useEffect(() => {
    setSubscribed(status.hasNotifications)
  }, [status.hasNotifications])

  const enableNotifications = async () => {
    if (!status) {
      console.error('Missing status information')
      return
    }

    setIsInitializing(true)
    notificationService.clearError()

    try {
      // Initialize notifications (request permission + get token)
      const token = await notificationService.initialize()

      if (token) {
        // Subscribe to backend
        await subscribe({
          entryId: status.sessionToken,
          fcmToken: token,
        })
        setSubscribed(true)
        console.info('Notifications enabled successfully!')
      }
    } catch (error) {
      console.error('Error enabling notifications:', error)
    } finally {
      setIsInitializing(false)
    }
  }

  const dismissBanner = () => {
    setSubscribed(true)
  }

  // Don't show if already subscribed or queue is completed
  if (subscribed || status?.status === 'SERVED' || status?.status === 'CANCELLED') {
    return null
  }

  // Don't show if not supported
  if (!notificationState.isSupported) {
    return null
  }

  const isLoading = isInitializing || notificationState.isLoading || isSubscribing
  const hasError = notificationState.error !== null

  return (
    <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-3 mb-4 text-sm">
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-blue-400 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <div className="flex-1">
          <span className="text-blue-700 block">Get notified when it's your turn</span>
          {hasError && (
            <span className="text-red-600 text-xs mt-1 block">
              {notificationState.error?.message}
            </span>
          )}
        </div>
        <button
          onClick={dismissBanner}
          disabled={isLoading}
          className="text-gray-500 hover:text-gray-700 font-medium text-xs px-3 py-1 border border-gray-300 rounded-full bg-white/80 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Dismiss
        </button>
        <button
          onClick={enableNotifications}
          disabled={isLoading}
          className="text-blue-600 hover:text-blue-800 font-medium text-xs px-3 py-1 border border-blue-300 rounded-full bg-white/80 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          {isLoading && (
            <svg
              className="animate-spin h-3 w-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {hasError ? 'Retry' : 'Enable'}
        </button>
      </div>
    </div>
  )
}
