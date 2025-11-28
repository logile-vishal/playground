import type { DirectResponse } from "@/core/types/pagination.type";
// import { get } from "@/core/services/http-base-service";
// import { API_CONFIG } from "@/core/constants/api-config";
import { useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import type { User } from "@/core/types/user.type";
import { queryPersister } from "@/core/utils/query-persister";
import { useEffect, useState } from "react";

// Create persister instance once, outside component
const { getFromCache, saveToCache } = queryPersister();

export const useUser = (): UseQueryResult<User> & { isLoadingCache: boolean } => {
  const queryClient = useQueryClient();
  const [hasHydrated, setHasHydrated] = useState(false);

  // Hydrate cache from localStorage on mount
  useEffect(() => {
    const cachedUser = getFromCache<User>();
    if (cachedUser) {
      // Set the cache data before query runs
      queryClient.setQueryData(['me'], cachedUser);
    }
    setHasHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const queryResult = useQuery<User>({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await getUserDetails();
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
export const getUserDetails: () => Promise<DirectResponse<User>> = () => {
  //   return get<DirectResponse<UserType>>(API_CONFIG.user.getUserDetails); // TODO: Uncomment this line when backend is ready

  // Mocked response for demonstration
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        data: {
          "userId": 98765432101,
          "userName": "John Doe",
          "orgId": 45678912345,
          "orgName": "Deli Store - Downtown Branch",
          "orgType": "Retail",
          "orgLevelId": 2001,
          "orgLevelName": "Store Level",
          "positionId": 11223344556,
          "positionName": "Store Supervisor",
          "isAdmin": true,
          "parentPositionId": 99887766554
        }
      });
    }, 1000);

    setTimeout(() => {
      reject(new Error("Failed to fetch user details"));
    }, 1000);
  });
};
