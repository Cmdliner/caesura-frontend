import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { userManager, tokenManager } from '@/lib/utils';

interface AuthContextType {
  user: API.User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: API.User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<API.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const storedUser = userManager.getUser();
    const hasToken = tokenManager.hasToken();

    if (storedUser && hasToken) {
      setUser(storedUser);
    }

    setIsLoading(false);
  }, []);

  const isAuthenticated = user !== null && tokenManager.hasToken();

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
