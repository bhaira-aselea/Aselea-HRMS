import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'admin' | 'hr' | 'employee' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  userName: string;
  login: (username: string, password: string) => boolean;
  selectRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy credentials
const VALID_USERNAME = 'bhaira123';
const VALID_PASSWORD = '123456';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState('');

  const login = useCallback((username: string, password: string): boolean => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsAuthenticated(true);
      setUserName(username);
      return true;
    }
    return false;
  }, []);

  const selectRole = useCallback((role: UserRole) => {
    setUserRole(role);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName('');
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userName, login, selectRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
