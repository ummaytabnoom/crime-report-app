import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { api } from "../api";
import { clearSavedUser, getSavedUser, saveUser } from "../storage";
import type { User } from "../types";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (value: string, password: string) => Promise<User>;
  signUp: (data: Parameters<typeof api.register>[0]) => Promise<User>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSavedUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const signIn = useCallback(async (value: string, password: string) => {
    const result = await api.login(value, password);
    await saveUser(result.user);
    setUser(result.user);
    return result.user;
  }, []);

  const signUp = useCallback(async (data: Parameters<typeof api.register>[0]) => {
    const result = await api.register(data);
    await saveUser(result.user);
    setUser(result.user);
    return result.user;
  }, []);

  const signOut = useCallback(async () => {
    await clearSavedUser();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user) return;
    const fresh = await api.me(user.id);
    await saveUser(fresh);
    setUser(fresh);
  }, [user]);

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut, refreshUser }),
    [user, loading, signIn, signUp, signOut, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
