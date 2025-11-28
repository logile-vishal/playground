import { type ReactNode } from "react";
import { AuthContext } from "@/core/services/auth.service";
import { useUser } from "@/core/hooks/useFetchUser";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    data: user,
    isLoading,
    isError,
    refetch,
    isFetching,
    isLoadingCache,
  } = useUser();

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isLoading || isFetching,
        isError,
        refetch,
        isLoadingCache,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
