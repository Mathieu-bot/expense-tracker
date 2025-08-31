import React, { useState } from "react";
import { ProfileForm } from "../components/Profile/ProfileForm";
import { PasswordForm } from "../components/Profile/PasswordForm";
import { Button } from "../ui";
import { useUserStore } from "../stores/userStore";
import type {
  ChangePasswordRequest,
  UpdateProfileRequest,
} from "../types/UserProfile";

export const Profile: React.FC = () => {
  const { user, loading, error, fetchProfile, updateProfile, changePassword } =
    useUserStore();
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleUpdateProfile = async (data: UpdateProfileRequest) => {
    setUpdating(true);
    const result = await updateProfile(data);
    setUpdating(false);
    return result;
  };

  const handleChangePassword = async (data: ChangePasswordRequest) => {
    setChangingPassword(true);
    const result = await changePassword(data);
    setChangingPassword(false);
    return result;
  };

  if (loading) {
    return (
      <div className="relative min-h-screen z-2 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative min-h-screen z-2 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Please Log In
          </h2>
          <p className="text-gray-600 mb-4">
            You need to be logged in to view your profile
          </p>
          <Button
            onClick={() => (window.location.href = "/login")}
            size="medium"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen z-2 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchProfile} size="medium">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10 relative z-2 pt-30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <ProfileForm
            profile={user}
            onUpdate={handleUpdateProfile}
            loading={updating}
          />

          <PasswordForm
            onChangePassword={handleChangePassword}
            loading={changingPassword}
          />
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Member since:</span>
              <span className="text-gray-600">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
