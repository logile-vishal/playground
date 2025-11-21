import { AuthContext } from '@/core/services/auth.service'
import { useUser } from '@/core/hooks/useFetchUser';

export const AuthProvider = ({ children }) => {
  const { data: user, isLoading, isError, refetch } = useUser();

  return (
    <AuthContext.Provider value={{ user, isLoading, isError, refetch }}>
      {children}
    </AuthContext.Provider>
  );
};
