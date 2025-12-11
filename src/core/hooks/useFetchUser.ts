import type { DirectResponse } from "@/core/types/pagination.type";
import { get } from "@/core/services/http-base-service";
import { API_CONFIG } from "@/core/constants/api-config";
import {
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { User } from "@/core/types/user.type";
import { queryPersister } from "@/core/utils/query-persister";
import { useEffect, useState } from "react";
import { useNotification } from "@/core/services/notification.service";
import { Severity } from "@/core/types/severity.type";

// Create persister instance once, outside component
const { getFromCache, saveToCache } = queryPersister({
  key: "user-cache",
  expiryKey: "user-cache-expiry",
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
});

export const useUser = (): UseQueryResult<User> & {
  isLoadingCache: boolean;
} => {
  const { notify } = useNotification();
  const queryClient = useQueryClient();
  const [hasHydrated, setHasHydrated] = useState(false);

  // Hydrate cache from localStorage on mount
  useEffect(() => {
    const cachedUser = getFromCache<User>();
    if (cachedUser) {
      // Set the cache data before query runs
      queryClient.setQueryData(["me"], cachedUser);
    }
    setHasHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const queryResult = useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await getUserDetails(notify);
      // Save to localStorage after successful fetch
      saveToCache(data);
      return data;
    },
    enabled: hasHydrated, // Don't run until we've checked localStorage
    staleTime: Infinity, // Keep data fresh - prevents all refetching
    gcTime: 30 * 60 * 1000, // 30 minutes: keep in memory cache
  });

  // Override isLoading to account for hydration
  return {
    ...(queryResult as UseQueryResult<User>),
    isLoadingCache: !hasHydrated,
    isLoading: !hasHydrated || queryResult.isLoading,
  } as UseQueryResult<User> & { isLoadingCache: boolean };
};

/**
 * @method getUserDetails
 * @description fetch user details
 */
export const getUserDetails: (notify) => Promise<DirectResponse<User>> = async (
  notify
) => {
  try {
    return await get<DirectResponse<User>>(API_CONFIG.user.getUserDetails);
  } catch (error) {
    notify({
      title: "Error fetching user details",
      config: {
        severity: Severity.ERROR,
      },
    });
    throw error;
  }
};
