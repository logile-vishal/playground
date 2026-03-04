import { type ReactNode } from "react";
import { AuthContext } from "@/core/services/auth.service";
import type { User } from "@/core/types/user.type";

// Mock user — no login required in the playground
const MOCK_USER: User = {
  userId: 1,
  userName: "Playground User",
  orgId: 1,
  orgName: "Logile",
  orgLevelId: 1,
  orgLevelName: "Store",
  positionId: 1,
  positionName: "PM / Designer",
  isAdmin: true,
};

export function PlaygroundAuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider
      value={{
        user: MOCK_USER,
        isLoading: false,
        isError: false,
        isLoadingCache: false,
        refetch: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
