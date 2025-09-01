import { create } from "zustand";
import { UserService } from "../services/UserService";
import type {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "../types/UserProfile";

interface UserState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (
    data: UpdateProfileRequest
  ) => Promise<{ success: boolean; error?: string }>;
  changePassword: (
    data: ChangePasswordRequest
  ) => Promise<{ success: boolean; error?: string }>;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const userProfile = await UserService.getProfile();
      set({ user: userProfile, loading: false });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch profile";
      set({ error: errorMessage, loading: false, user: null });
    }
  },

  updateProfile: async (data: UpdateProfileRequest) => {
    try {
      set({ error: null });
      const updatedProfile = await UserService.updateProfile(data);
      set({ user: updatedProfile });
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update profile";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  changePassword: async (data: ChangePasswordRequest) => {
    try {
      set({ error: null });
      await UserService.changePassword(data);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to change password";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  clearUser: () => {
    set({ user: null, error: null });
  },
}));
