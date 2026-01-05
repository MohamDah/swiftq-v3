import axiosInstance from "@/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import type { SubscribeNotificationParams } from "@/types/notifications";
import type { ApiError } from "@/types/ApiError";

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function subscribeWithRetry(
  params: SubscribeNotificationParams,
  retryCount = 0
): Promise<unknown> {
  try {
    const response = await axiosInstance.post(`push/subscribe/${params.entryId}`, {
      fcmToken: params.fcmToken
    });
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    // Don't retry on client errors (4xx) except 429 (rate limit)
    const status = apiError?.response?.status;
    const isRetryableError = 
      !status || // Network error
      status >= 500 || // Server error
      status === 429; // Rate limit

    if (isRetryableError && retryCount < MAX_RETRIES) {
      // Exponential backoff: 1s, 2s, 4s
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`Retrying subscription (attempt ${retryCount + 1}/${MAX_RETRIES}) in ${delay}ms...`);
      
      await sleep(delay);
      return subscribeWithRetry(params, retryCount + 1);
    }

    // Re-throw if not retryable or max retries reached
    throw error;
  }
}

export function useSubscribeNotifs() {
  return useMutation({
    mutationFn: async (params: SubscribeNotificationParams) => {
      return subscribeWithRetry(params);
    },
    retry: false,
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const status = apiError?.response?.status;
      const message = apiError?.response?.data?.message || (error as Error).message;
      
      console.error('Failed to subscribe to notifications:', {
        status,
        message,
        error
      });
    },
    onSuccess: () => {
      console.log('Successfully subscribed to notifications');
    }
  });
}
