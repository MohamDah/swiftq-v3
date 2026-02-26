import { useQuery } from '@tanstack/react-query'

import axiosInstance from '@/api/axiosInstance'
import { PublicQueueDetails } from '@/types/api'

import { QueryKeys } from './queryKeys'

export function usePublicQueueDetailsQuery(qrCode: string | null) {
  return useQuery({
    queryKey: [QueryKeys.PUBLIC_QUEUE, qrCode],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PublicQueueDetails>(`queues/${qrCode}`)
      return data
    },
    enabled: !!qrCode,
  })
}
