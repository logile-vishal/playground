import type { DirectResponse } from "@/core/types/pagination.type";
// import { get } from "@/core/services/http-base-service";
// import { API_CONFIG } from "@/core/constants/api-config";
import { useQuery } from "@tanstack/react-query";
import type { UserType } from "@/core/types/user.type";

export const useUser = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await getUserDetails();
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes: data considered fresh
    refetchOnWindowFocus: false, // don’t refetch just by focusing tab
  });
};

  /**
  * @method getUserDetails
  * @description fetch user details
  */
  export const getUserDetails: () => Promise<DirectResponse<UserType>> = () => {
    //   return get<DirectResponse<UserType>>(API_CONFIG.user.getUserDetails); // TODO: Uncomment this line when backend is ready

    // Mocked response for demonstration
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: {
                    id: 'user_123',
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    role: ['admin', 'user'],
                    // role: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            });
        }, 1000);

        setTimeout(() => {
            reject(new Error("Failed to fetch user details"));
        }, 1000);
    });
};
