type QueueEntryStatus = 'WAITING' | 'CALLED' | 'SERVED' | 'CANCELLED' | 'NO_SHOW'

export interface UserDto {
  id: number
  email: string
  businessName: string
}

export interface QueueItem {
  id: string
  qrCode: string
  name: string
  description: null | string
  isActive: boolean
  maxSize: null | number
  averageServiceTime: number
  requireNames: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  hostId: string
  _count?: {
    entries: number
  }
}

export interface PublicQueueDetails {
  qrCode: string
  name: string
  description: string | null
  businessName: string
  isActive: boolean
  maxSize: number | null
  averageServiceTime: number
  requireNames: boolean
  currentSize: number
}

export interface HostQueueDetails extends Omit<QueueItem, '_count'> {
  host: UserDto
  entries: Customer[]
}

export interface Customer {
  id: string
  position: number
  storePosition: number
  customerName: string | null
  displayNumber: string
  status: QueueEntryStatus
  joinedAt: string
  calledAt: string | null
  estimatedWaitTime: number
}

export type CustomerSessions = Record<string, string | undefined>

export interface ExistingPosResponse {
  hasEntry: boolean
}

export interface CustomerStatus {
  sessionToken: string
  position: number
  storePosition: number
  status: QueueEntryStatus
  estimatedWaitTime: number | null
  customerName: string | null
  displayNumber: string
  joinedAt: string
  calledAt: string | null
  peopleAhead: number
  hasNotifications: boolean
  queue: {
    id: string
    qrCode: string
    name: string
    description: string | null
    businessName: string
    totalWaiting: number
    isActive: boolean
    averageServiceTime: number
  }
}

export interface UpdateEntryDto {
  status?: QueueEntryStatus
}

export interface EntryUpdatePayload {
  type: 'QUEUE_ADVANCED' | 'CALL'
  displayNumber?: string
}

export interface QueueUpdatePayload {
  type: 'ENTRY_JOINED' | 'QUEUE_ADVANCED' | 'QUEUE_UPDATED'
  currentSize?: number
  estimatedWaitTime?: number
}

export type TimeFilter = 'today' | 'yesterday' | 'week' | 'month' | 'all'
export interface AnalyticsDto {
  peakHour: {
    hour: number
    count: number
  }
  averageWaitTime: number
  averageCustomers: number
  totalCustomers: number
  totalQueues: number
}
