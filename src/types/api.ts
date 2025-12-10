export interface UserDto {
  id: number;
  email: string;
  displayName: string;
}

export interface QueueItem {
  id: string;
  qrCode: string;
  name: string;
  description: null;
  isActive: boolean;
  maxSize: null;
  averageServiceTime: number;
  requireNames: boolean;
  createdAt: string;
  updatedAt: string;
  hostId: string;
  _count?: {
    entries: number
  }
}