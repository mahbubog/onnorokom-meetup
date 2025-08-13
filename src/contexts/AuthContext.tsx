import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  pin: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (pin: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
  isLoading: boolean;
}

interface RegisterData {
  name: string;
  pin: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('onnorokom_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (pin: string, password: string, rememberMe = false): Promise<boolean> => {
    try {
      // Admin login
      if (pin === 'admin' && password === '123456') {
        const adminUser: User = {
          id: 'admin',
          name: 'System Administrator',
          pin: 'admin',
          email: 'admin@onnorokom.com',
          phone: '+880',
          department: 'Administration',
          designation: 'System Administrator',
          role: 'admin'
        };
        setUser(adminUser);
        localStorage.setItem('onnorokom_user', JSON.stringify(adminUser));
        return true;
      }

      // Regular user login (mock implementation)
      // In real app, this would make API call to verify credentials
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'John Doe',
          pin: '1234',
          email: 'john@onnorokom.com',
          phone: '+8801234567890',
          department: 'Software Development',
          designation: 'Senior Developer',
          role: 'user'
        }
      ];

      const foundUser = mockUsers.find(u => u.pin === pin);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('onnorokom_user', JSON.stringify(foundUser));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      // Mock registration - in real app would make API call
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        pin: userData.pin,
        email: userData.email,
        phone: userData.phone,
        department: userData.department,
        designation: userData.designation,
        role: 'user'
      };
      
      // Store in localStorage for demo
      const existingUsers = JSON.parse(localStorage.getItem('onnorokom_users') || '[]');
      existingUsers.push(newUser);
      localStorage.setItem('onnorokom_users', JSON.stringify(existingUsers));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('onnorokom_user');
  };

  const value = {
    user,
    login,
    logout,
    register,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};