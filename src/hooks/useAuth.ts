import { useState, useCallback, useEffect } from 'react';

export interface AuthUser {
  address: string;
  chainIds?: string[];
}

const LOCAL_STORAGE_KEY = 'chainbridge_auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Only run on client-side
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored auth data:', e);
      }
    }
    setLoading(false);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [user, initialized]);

  const login = useCallback(async (address: string) => {
    setLoading(true);
    try {
      const userData = {
        address,
        chainIds: ['xion-testnet'],
      };
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return {
    user,
    loading,
    initialized,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
