import { createContext, useContext } from "react";

import type { User } from "@/core/types/user.type";

type AuthContext = {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  isLoadingCache: boolean;
};

export const AuthContext = createContext<AuthContext | null>(null);

export const useAuth: () => AuthContext = () =>
  useContext(AuthContext) as AuthContext;
