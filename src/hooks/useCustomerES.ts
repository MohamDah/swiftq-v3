import { useQueryClient } from "@tanstack/react-query";
import { useEventSource } from "./useEventSource";
import { useEffect } from "react";
import { QueryKeys } from "@/queries/queryKeys";

export function useCustomerES({ qrCode, sessionToken }: { qrCode?: string, sessionToken?: string }) {
  const enabled = !!qrCode && !!sessionToken
  const { data } = useEventSource(enabled ? `entries/updates/${qrCode}/${sessionToken}` : '')
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: [QueryKeys.CUSTOMER_STATUS, qrCode] })
  }, [data, qrCode, queryClient])
}