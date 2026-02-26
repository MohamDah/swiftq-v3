import { useQuery } from '@tanstack/react-query'

import axiosInstance from '@/api/axiosInstance'
import { UserDto } from '@/types/api'
import { ApiError } from '@/types/ApiError'

import { QueryKeys } from './queryKeys'

export function useCurrentUser() {
  return useQuery<UserDto, ApiError>({
    queryKey: [QueryKeys.CURRENT_USER],
    queryFn: async () => {
      const { data } = await axiosInstance.get<UserDto>('/auth')
      return data
    },
  })
}
