import { create } from "zustand";
import { User } from "@/types";
import { api } from "@/lib/api";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  checkAuth: () => Promise<boolean>;
  login: (formData: FormData) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const status = await api.getStatus();
      if (status.logged_in && status.username) {
        const user: User = {
          username: status.username,
          role: status.role || "USER",
          mustChangePassword: status.must_change_password,
        };
        set({ user, isAuthenticated: true, isLoading: false });
        return true;
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return false;
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return false;
    }
  },

  login: async (formData: FormData) => {
    await api.login(formData);
    const status = await api.getStatus();
    const user: User = {
      username: status.username || "",
      role: status.role || "USER",
      mustChangePassword: status.must_change_password,
    };
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await api.logout();
    } catch {}
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
}));
