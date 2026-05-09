import { create } from 'zustand';
import axios from 'axios';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface ServerHealth {
  status: string;
  timestamp: string;
  database?: string; // Will be hydrated from backend configuration
  broker?: string;
  mode?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  serverUrl: string;
  authStrategy: 'JWT' | 'SESSION';
  serverHealth: ServerHealth | null;
  isConnecting: boolean;
  
  setServerUrl: (url: string) => void;
  setAuthStrategy: (strategy: 'JWT' | 'SESSION') => void;
  setToken: (token: string | null) => void;
  loginSuccess: (user: User, token?: string) => void;
  logout: () => void;
  checkServerHealth: () => Promise<void>;
}

const LOCAL_STORAGE_URL_KEY = 'smarttask_server_url';
const LOCAL_STORAGE_TOKEN_KEY = 'smarttask_token';
const LOCAL_STORAGE_STRATEGY_KEY = 'smarttask_strategy';
const LOCAL_STORAGE_USER_KEY = 'smarttask_user';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_KEY) || 'null'),
  token: localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY),
  serverUrl: localStorage.getItem(LOCAL_STORAGE_URL_KEY) || 'http://localhost:3000',
  authStrategy: (localStorage.getItem(LOCAL_STORAGE_STRATEGY_KEY) as 'JWT' | 'SESSION') || 'JWT',
  serverHealth: null,
  isConnecting: false,

  setServerUrl: (url) => {
    localStorage.setItem(LOCAL_STORAGE_URL_KEY, url);
    set({ serverUrl: url });
    get().checkServerHealth();
  },

  setAuthStrategy: (strategy) => {
    localStorage.setItem(LOCAL_STORAGE_STRATEGY_KEY, strategy);
    set({ authStrategy: strategy });
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    }
    set({ token });
  },

  loginSuccess: (user, token) => {
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    if (token) {
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    }
    set({ user, token: token || get().token });
  },

  logout: () => {
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    set({ user: null, token: null });
  },

  checkServerHealth: async () => {
    set({ isConnecting: true });
    try {
      const url = get().serverUrl;
      // Get the status from health endpoint
      const response = await axios.get(`${url}/health`, { timeout: 3000 });
      
      const serverStrategy = response.data.authStrategy;
      if (serverStrategy && (serverStrategy === 'JWT' || serverStrategy === 'SESSION')) {
        if (get().authStrategy !== serverStrategy) {
          console.log(`%c[Auth Sync] Backend reported ${serverStrategy}. Auto-aligning frontend!`, 'color: #10b981; font-weight: bold;');
          localStorage.setItem(LOCAL_STORAGE_STRATEGY_KEY, serverStrategy);
          set({ authStrategy: serverStrategy });
        }
      }

      set({ 
        serverHealth: {
          status: response.data.status || 'UP',
          timestamp: response.data.timestamp || new Date().toISOString(),
          database: response.data.database || 'Detected (Mongo/Pg)',
          broker: response.data.broker || 'Active',
          mode: response.data.mode || 'Active'
        },
        isConnecting: false 
      });
    } catch (err) {
      set({ serverHealth: null, isConnecting: false });
    }
  }
}));
