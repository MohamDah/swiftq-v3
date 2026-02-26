import { useMutation, useQueryClient } from '@tanstack/react-query'

import axiosInstance from '@/api/axiosInstance'
import { Customer } from '@/types/api'
import { saveNewPosition } from '@/utils/customerStorage'

import { QueryKeys } from '../queryKeys'

export function useJoinQueueMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ qrCode, customerName }: { qrCode: string; customerName?: string }) => {
      const { data } = await axiosInstance.post<Customer>(`queues/${qrCode}/join`, { customerName })
      return data
    },
    onSuccess: (data, { qrCode }) => {
      saveNewPosition(qrCode, data.id)
      return queryClient.invalidateQueries({
        queryKey: [QueryKeys.CUSTOMER_STATUS],
      })
    },
  })
}
