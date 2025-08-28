import { useState } from "react";
import { useUserProfile } from "../hooks/useUserProfile";
import { ProfileForm } from "../components/Profile/ProfileForm";
import { PasswordForm } from "../components/Profile/PasswordForm";
import { Button } from "../ui";
import type {
  ChangePasswordRequest,
  UpdateProfileRequest,
} from "../types/UserProfile";

export const Profile = () => {
  const {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    changePassword,
  } = useUserProfile();
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
      <div className="min-h-screen flex items-center justify-center relative z-2">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-2">
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

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-2">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Profile Not Found
          </h2>
          <p className="text-gray-600">Unable to load user profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 relative z-2">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          <ProfileForm
            profile={profile}
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
                {new Date(profile.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
