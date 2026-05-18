import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (email: string, password: string, name: string, role?: UserRole) => boolean;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  createUser: (email: string, password: string, name: string, role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'taskapp_users',
  CURRENT_USER: 'taskapp_current_user',
};

const DEFAULT_ADMIN: User = {
  id: 'admin-1',
  email: 'admin@taskapp.com',
  password: 'admin123',
  role: 'admin',
  name: 'Administrador',
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    const storedCurrentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers([DEFAULT_ADMIN]);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([DEFAULT_ADMIN]));
    }

    if (storedCurrentUser) {
      setCurrentUser(JSON.parse(storedCurrentUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  const register = (email: string, password: string, name: string, role: UserRole = 'collaborator'): boolean => {
    if (users.some((u) => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      role,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
    return true;
  };

  const createUser = (email: string, password: string, name: string, role: UserRole): boolean => {
    return register(email, password, name, role);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, ...updates } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));

    if (currentUser?.id === userId) {
      const updatedCurrentUser = { ...currentUser, ...updates };
      setCurrentUser(updatedCurrentUser);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedCurrentUser));
    }
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter((u) => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        logout,
        register,
        updateUser,
        deleteUser,
        createUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
