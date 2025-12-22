import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "./queryKeys";
import { CustomerStatus } from "@/types/api";
import { getPositionToken } from "@/utils/customerStorage";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";

export function useCustomerStatus(qrCode: string | null) {
  const navigate = useNavigate()
  return useQuery({
    queryKey: [QueryKeys.CUSTOMER_STATUS, qrCode],
    queryFn: async () => {
      const posToken = getPositionToken(qrCode || '')
      if (!posToken) return navigate(`/join/${qrCode}`, { replace: true })

      const { data } = await axiosInstance.get<CustomerStatus>(`queues/entry-status/${posToken}`)
      return data
    },
    enabled: !!qrCode
  })
}