import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import axiosInstance from '@/api/axiosInstance'
import { CustomerStatus } from '@/types/api'
import { getPositionToken } from '@/utils/customerStorage'

import { QueryKeys } from './queryKeys'

export function useCustomerStatus(qrCode: string | null) {
  const navigate = useNavigate()
  return useQuery({
    queryKey: [QueryKeys.CUSTOMER_STATUS, qrCode],
    queryFn: async () => {
      const posToken = getPositionToken(qrCode || '')
      if (!posToken) return navigate(`/join/${qrCode}`, { replace: true })

      const { data } = await axiosInstance.get<CustomerStatus>(`entries/${posToken}/status`)
      return data
    },
    enabled: !!qrCode,
    gcTime: 0,
    staleTime: 0,
  })
}
