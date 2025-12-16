import { QueryClient } from "@tanstack/react-query";
import { QueryKeys } from "../queryKeys";

export function invalidateEntryQueries(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: [QueryKeys.CUSTOMER_STATUS] }),
    queryClient.invalidateQueries({ queryKey: [QueryKeys.HOST_QUEUE] }),
    queryClient.invalidateQueries({ queryKey: [QueryKeys.EXISTING_POS] }),
  ])
}