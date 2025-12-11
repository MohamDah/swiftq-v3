export interface UserDto {
  id: number;
  email: string;
  businessName: string;
}

export interface QueueItem {
  id: string;
  qrCode: string;
  name: string;
  description: null | string;
  isActive: boolean;
  maxSize: null | number;
  averageServiceTime: number;
  requireNames: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: Date | null;
  hostId: string;
  _count?: {
    entries: number
  }
}

export interface PublicQueueDetails {
  qrCode: string;
  name: string;
  description: string | null;
  businessName: string;
  isActive: boolean;
  maxSize: number | null;
  averageServiceTime: number;
  requireNames: boolean;
  estimatedWaitTime: number;
  currentSize: number;
  isFull: boolean;
}

export interface HostQueueDetails extends Omit<QueueItem, '_count'> {
  host: UserDto;
  entries: Customer[]
}

export interface Customer {
  id: string;
  position: number;
  customerName: string | null;
  status: 'WAITING' | 'CALLED' | 'SERVED' | 'CANCELLED' | 'NO_SHOW';
  estimatedWaitTime: number | null;
  joinedAt: Date;
  calledAt: Date | null;
}

export type CustomerSessions = Record<string, string | undefined>

export interface ExistingPosResponse {
  hasEntry: boolean;
  entry: Customer | null
}