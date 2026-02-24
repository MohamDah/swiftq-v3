import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "./queryKeys";
import axiosInstance from "@/api/axiosInstance";
import { AnalyticsDto, TimeFilter } from "@/types/api";

export function useAnalytics({filter}: {filter: TimeFilter}) {
  return useQuery({
    queryKey: [QueryKeys.ANALYTICS, filter],
    queryFn: async () => {
      const { data } = await axiosInstance.get<AnalyticsDto>(`queues/analytics?filter=${filter}`)
      return data
    }
  })
}