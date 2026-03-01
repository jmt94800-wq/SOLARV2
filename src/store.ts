import { createContext, useContext } from 'react';

type Role = 'AGENT' | 'MANAGER';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  agentId: string;
  agentName: string;
  setAgentName: (name: string) => void;
}

export const AppContext = createContext<AppContextType>({
  role: 'AGENT',
  setRole: () => {},
  agentId: 'agent-1',
  agentName: '',
  setAgentName: () => {},
});

export const useAppContext = () => useContext(AppContext);
