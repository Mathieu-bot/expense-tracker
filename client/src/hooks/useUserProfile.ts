import { useState, useEffect } from "react";
import { UserService } from "../services/UserService";
import type {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "../types/UserProfile";

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userProfile = await UserService.getProfile();
      setProfile(userProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (
    data: UpdateProfileRequest
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      const updatedProfile = await UserService.updateProfile(data);
      setProfile(updatedProfile);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update profile";
      return { success: false, error: errorMessage };
    }
  };

  const changePassword = async (
    data: ChangePasswordRequest
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      await UserService.changePassword(data);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to change password";
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    changePassword,
  };
};
