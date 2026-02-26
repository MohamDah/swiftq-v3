import { getToken, type Messaging, onMessage } from 'firebase/messaging'

import { getMessagingInstance } from '../fcm/config'
import type {
  NotificationError,
  NotificationState,
  ServiceWorkerRegistrationOptions,
} from '../types/notifications'

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY
const SW_PATH = '/firebase-messaging-sw.js'
const SW_SCOPE = '/'

class NotificationService {
  private swRegistration: ServiceWorkerRegistration | null = null
  private fcmToken: string | null = null
  private listeners: Set<(state: NotificationState) => void> = new Set()
  private state: NotificationState = {
    permission: 'default',
    isSupported: false,
    fcmToken: null,
    isLoading: false,
    error: null,
  }

  constructor() {
    this.initializeState()
  }

  private async initializeState() {
    this.state.isSupported = await this.checkSupport()
    this.state.permission = this.getPermissionStatus()
    this.notifyListeners()
  }

  private async checkSupport(): Promise<boolean> {
    if (globalThis.window === undefined) return false
    if (!('serviceWorker' in navigator)) return false
    if (!('Notification' in globalThis)) return false
    if (!('PushManager' in globalThis)) return false

    try {
      const messaging = await getMessagingInstance()
      return messaging !== null
    } catch {
      return false
    }
  }

  private getPermissionStatus(): NotificationPermission {
    if (globalThis.window === undefined || !('Notification' in globalThis)) {
      return 'default'
    }
    return Notification.permission
  }

  private notifyListeners() {
    for (const listener of this.listeners) listener({ ...this.state })
  }

  private updateState(updates: Partial<NotificationState>) {
    this.state = { ...this.state, ...updates }
    this.notifyListeners()
  }

  private createError(
    type: NotificationError['type'],
    message: string,
    originalError?: unknown,
  ): NotificationError {
    return { type, message, originalError }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Register the service worker with retry logic
   */
  async registerServiceWorker(
    options: ServiceWorkerRegistrationOptions = {},
  ): Promise<ServiceWorkerRegistration | null> {
    const { maxRetries = 3, retryDelay = 1000 } = options

    if (!this.state.isSupported) {
      console.warn('Service workers not supported')
      return null
    }

    // Check for existing registration
    try {
      const existingReg = await navigator.serviceWorker.getRegistration(SW_PATH)
      if (existingReg) {
        console.info('Found existing service worker registration')
        this.swRegistration = existingReg
        return existingReg
      }
    } catch (error) {
      console.error('Error checking for existing registration:', error)
    }

    // Register new service worker with retry
    let lastError: unknown
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.info(`Registering service worker (attempt ${attempt}/${maxRetries})`)
        const registration = await navigator.serviceWorker.register(SW_PATH, {
          scope: SW_SCOPE,
        })

        // Wait for activation if needed
        await this.waitForActivation(registration)

        console.info('Service worker registered and activated successfully')
        this.swRegistration = registration
        return registration
      } catch (error) {
        lastError = error
        console.error(`Service worker registration attempt ${attempt} failed:`, error)

        if (attempt < maxRetries) {
          const delay = retryDelay * attempt // Exponential backoff
          console.info(`Retrying in ${delay}ms...`)
          await this.sleep(delay)
        }
      }
    }

    const errorObj = this.createError(
      'sw-registration-failed',
      'Failed to register service worker after multiple attempts',
      lastError,
    )
    this.updateState({ error: errorObj })
    return null
  }

  /**
   * Wait for service worker to reach activated state
   */
  private async waitForActivation(registration: ServiceWorkerRegistration): Promise<void> {
    const sw = registration.installing || registration.waiting || registration.active
    if (!sw) {
      throw new Error('No service worker found in registration')
    }

    if (sw.state === 'activated') {
      return
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Service worker activation timeout'))
      }, 10_000)

      sw.addEventListener('statechange', function handler() {
        if (sw.state === 'activated') {
          clearTimeout(timeout)
          sw.removeEventListener('statechange', handler)
          resolve()
        } else if (sw.state === 'redundant') {
          clearTimeout(timeout)
          sw.removeEventListener('statechange', handler)
          reject(new Error('Service worker became redundant'))
        }
      })
    })
  }

  /**
   * Request notification permission from the user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.state.isSupported) {
      const error = this.createError(
        'not-supported',
        'Notifications are not supported in this browser',
      )
      this.updateState({ error })
      throw error
    }

    this.updateState({ isLoading: true, error: null })

    try {
      const permission = await Notification.requestPermission()
      this.updateState({ permission, isLoading: false })

      if (permission === 'denied') {
        const error = this.createError(
          'permission-denied',
          'Notification permission was denied. Please enable notifications in your browser settings.',
        )
        this.updateState({ error })
      }

      return permission
    } catch (error) {
      const errorObj = this.createError(
        'unknown',
        'Failed to request notification permission',
        error,
      )
      this.updateState({ error: errorObj, isLoading: false })
      throw errorObj
    }
  }

  /**
   * Get FCM token for push notifications
   */
  async getToken(forceRefresh = false): Promise<string | null> {
    if (this.fcmToken && !forceRefresh) {
      return this.fcmToken
    }

    if (!this.state.isSupported) {
      const error = this.createError('not-supported', 'FCM is not supported')
      this.updateState({ error })
      return null
    }

    if (this.state.permission !== 'granted') {
      const error = this.createError(
        'permission-denied',
        'Notification permission must be granted before getting token',
      )
      this.updateState({ error })
      return null
    }

    this.updateState({ isLoading: true, error: null })

    try {
      // Ensure service worker is registered
      if (!this.swRegistration) {
        this.swRegistration = await this.registerServiceWorker()
        if (!this.swRegistration) {
          throw new Error('Service worker registration failed')
        }
      }

      const messaging = await getMessagingInstance()
      if (!messaging) {
        throw new Error('Firebase messaging not available')
      }

      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: this.swRegistration,
      })

      if (!token) {
        throw new Error('No FCM token received')
      }

      this.fcmToken = token
      this.updateState({ fcmToken: token, isLoading: false })

      // Set up token refresh listener
      this.setupTokenRefreshListener(messaging)

      return token
    } catch (error) {
      console.error('Error getting FCM token:', error)
      const errorObj = this.createError(
        'token-retrieval-failed',
        'Failed to retrieve FCM token. Please try again.',
        error,
      )
      this.updateState({ error: errorObj, isLoading: false, fcmToken: null })
      return null
    }
  }

  /**
   * Set up listener for token refresh
   */
  private setupTokenRefreshListener(messaging: Messaging) {
    try {
      onMessage(messaging, payload => {
        console.info('Foreground message received:', payload)
        // Handle foreground messages if needed
      })
    } catch (error) {
      console.error('Error setting up message listener:', error)
    }
  }

  /**
   * Request permission and get FCM token in one call
   */
  async initialize(): Promise<string | null> {
    try {
      // Check if already granted
      if (this.state.permission === 'granted' && this.fcmToken) {
        return this.fcmToken
      }

      // Register service worker first (non-blocking)
      if (!this.swRegistration) {
        this.swRegistration = await this.registerServiceWorker()
      }

      // Request permission
      const permission = await this.requestPermission()
      if (permission !== 'granted') {
        return null
      }

      // Get token
      return await this.getToken()
    } catch (error) {
      console.error('Error initializing notifications:', error)
      return null
    }
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: NotificationState) => void): () => void {
    this.listeners.add(listener)
    // Immediately notify with current state
    listener({ ...this.state })

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Get current state
   */
  getState(): NotificationState {
    return { ...this.state }
  }

  /**
   * Clear error state
   */
  clearError() {
    this.updateState({ error: null })
  }

  /**
   * Reset state (useful for testing)
   */
  reset() {
    this.fcmToken = null
    this.swRegistration = null
    this.updateState({
      fcmToken: null,
      error: null,
      isLoading: false,
    })
  }

  /**
   * Check if service worker is healthy
   */
  async checkServiceWorkerHealth(): Promise<boolean> {
    if (!this.swRegistration) return false

    try {
      const sw =
        this.swRegistration.active || this.swRegistration.waiting || this.swRegistration.installing

      if (!sw) return false
      if (sw.state === 'redundant') return false

      return sw.state === 'activated' || sw.state === 'activating'
    } catch {
      return false
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService()
export default notificationService
