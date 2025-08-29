import { DefaultService } from "../api/services/DefaultService";
import { useMascotStore } from "../stores/mascotStore";
import type {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "../types/UserProfile";

interface ApiError {
  body?: { message?: string };
}

export class UserService {
  //GET user profile
  static async getProfile(): Promise<UserProfile> {
    try {
      const response = await DefaultService.getUserProfile();
      useMascotStore.getState().setExpression("success");
      return response as UserProfile;
    } catch (error: unknown) {
      useMascotStore.getState().setExpression("error");
      const err = error as ApiError;
      const errorMessage = err.body?.message || "Failed to fetch user profile";
      throw new Error(errorMessage);
    }
  }

  //UPDATE user profile
  static async updateProfile(
    profileData: UpdateProfileRequest
  ): Promise<UserProfile> {
    try {
      const response = await DefaultService.putUserProfile(profileData);
      useMascotStore.getState().setExpression("success");
      return response as UserProfile;
    } catch (error: unknown) {
      useMascotStore.getState().setExpression("error");
      const err = error as ApiError;
      const errorMessage = err.body?.message || "Failed to update profile";
      throw new Error(errorMessage);
    }
  }

  //CHANGE password
  static async changePassword(
    passwordData: ChangePasswordRequest
  ): Promise<{ message: string }> {
    try {
      const { ...apiData } = passwordData; // removes confirmPassword if exists
      const response = await DefaultService.patchUserProfilePassword(apiData);
      useMascotStore.getState().setExpression("success");
      return response as { message: string };
    } catch (error: unknown) {
      useMascotStore.getState().setExpression("error");
      const err = error as ApiError;
      const errorMessage = err.body?.message || "Failed to change password";
      throw new Error(errorMessage);
    }
  }
}
