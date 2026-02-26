import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import axiosInstance from '@/api/axiosInstance'
import { QueueItem } from '@/types/api'
import { displayError } from '@/utils/displayError'

import { QueryKeys } from '../queryKeys'

export interface UpdateQueueProps {
  isActive?: boolean
  averageServiceTime?: number
  name?: string
  description?: string
  maxSize?: number
  requireNames?: boolean
}

export function useUpdateQueueMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ queueId, ...data }: UpdateQueueProps & { queueId: string }) =>
      axiosInstance.patch<QueueItem>(`queues/${queueId}`, data),
    onError: error => {
      toast.error(displayError(error))
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.QUEUES],
        }),
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.HOST_QUEUE],
        }),
      ])
    },
  })
}
