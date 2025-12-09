export interface UserDto {
  id: number;
  email: string;
  displayName: string;
}

export interface QueueItem {
  _id: string;
  queueCode: string;
  hostId: string;
  hostName: string;
  queueName: string;
  isActive: boolean;
  requireCustomerName: boolean;
  estimatedWaitPerPerson: number | null;
  waitTimes: number[];
  createdAt: Date;
  updatedAt?: Date;
  customerCount: number;
}
