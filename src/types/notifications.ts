export type NotificationPermissionStatus = 'granted' | 'denied' | 'default';

export interface NotificationState {
  permission: NotificationPermissionStatus;
  isSupported: boolean;
  fcmToken: string | null;
  isLoading: boolean;
  error: NotificationError | null;
}

export type NotificationErrorType =
  | 'permission-denied'
  | 'not-supported'
  | 'token-retrieval-failed'
  | 'sw-registration-failed'
  | 'network-error'
  | 'unknown';

export interface NotificationError {
  type: NotificationErrorType;
  message: string;
  originalError?: unknown;
}

export interface SubscribeNotificationParams {
  entryId: string;
  fcmToken: string;
}

export interface ServiceWorkerRegistrationOptions {
  maxRetries?: number;
  retryDelay?: number;
}
