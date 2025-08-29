export interface UpdateProfileRequest {
  firstname?: string;
  lastname?: string;
  username?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface UserProfile {
  user_id: number;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  created_at: string;
}