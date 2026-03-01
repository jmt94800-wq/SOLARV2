import { createContext, useContext } from 'react';

type Role = 'AGENT' | 'MANAGER';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  agentId: string;
}

export const AppContext = createContext<AppContextType>({
  role: 'AGENT',
  setRole: () => {},
  agentId: 'agent-1',
});

export const useAppContext = () => useContext(AppContext);
