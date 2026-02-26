import { useQuery } from '@tanstack/react-query'

import axiosInstance from '@/api/axiosInstance'
import { AnalyticsDto, TimeFilter } from '@/types/api'

import { QueryKeys } from './queryKeys'

export function useAnalytics({ filter }: { filter: TimeFilter }) {
  return useQuery({
    queryKey: [QueryKeys.ANALYTICS, filter],
    queryFn: async () => {
      const { data } = await axiosInstance.get<AnalyticsDto>(`queues/analytics?filter=${filter}`)
      return data
    },
  })
}
