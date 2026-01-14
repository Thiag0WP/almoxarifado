import React, { createContext, ReactNode, useContext } from "react";
import { useSessionTimeout } from "../hooks/useSessionTimeout";

interface SessionContextType {
  resetarTimeout: () => void;
  timeoutMinutos: number;
  carregarTimeout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const sessionData = useSessionTimeout();

  return (
    <SessionContext.Provider value={sessionData}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
