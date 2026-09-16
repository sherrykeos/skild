"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "@/types/user";
import { authApi } from "@/lib/api/auth";
import { getStoredToken, setStoredToken } from "@/lib/api/client";

import { usersApi } from "@/lib/api/users";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCreator: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  becomeCreator: () => Promise<User>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await authApi.getMe();
      setUser(currentUser);
    } catch (error) {
      // Token might be expired, try to refresh
      try {
        const refreshResult = await authApi.refresh();
        if (refreshResult?.accessToken) {
          const currentUser = await authApi.getMe();
          setUser(currentUser);
        } else {
          setStoredToken(null);
          setUser(null);
        }
      } catch {
        setStoredToken(null);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    if (response?.user) {
      setUser(response.user);
    } else {
      await refreshUser();
    }
  };

  const register = async (username: string, email: string, password: string) => {
    await authApi.register({ username, email, password });
    // After registration, attempt login or guide to verify
    try {
      await login(email, password);
    } catch {
      // ignore auto-login failure if email verification is strictly required
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setStoredToken(null);
      setUser(null);
    }
  };

  const becomeCreator = async () => {
    const updatedUser = await usersApi.becomeCreator();
    setUser(updatedUser);
    return updatedUser;
  };

  const isCreator = user?.role === "CREATOR" || user?.role === "ADMIN";
  const isAdmin =
    user?.role === "ADMIN" ||
    user?.username?.toLowerCase() === "sherry" ||
    user?.email?.toLowerCase() === "shaj7492@gmail.com";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isCreator: !!isCreator,
        isAdmin: !!isAdmin,
        login,
        register,
        logout,
        refreshUser,
        becomeCreator,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
