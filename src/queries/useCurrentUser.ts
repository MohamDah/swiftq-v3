import { useQuery } from '@tanstack/react-query'
import { UserDto } from '@/types/api'
import axiosInstance from '@/api/axiosInstance'
import { ApiError } from '@/types/ApiError'

export function useCurrentUser() {
  return useQuery<UserDto, ApiError>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<UserDto>('/auth/me')
      return data
    },
  })
}
