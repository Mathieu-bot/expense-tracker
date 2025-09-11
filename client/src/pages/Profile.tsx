import React, { useState } from "react";
import { useUserStore } from "../stores/userStore";
import type {
  ChangePasswordRequest,
  UpdateProfileRequest,
} from "../types/UserProfile";
import {
  AppearanceTab,
  ErrorState,
  LoadingState,
  LoginPrompt,
  PasswordForm,
  ProfileForm,
  ProfileInfo,
} from "../components/profile";

export const Profile: React.FC = () => {
  const { user, loading, error, fetchProfile, updateProfile, changePassword } =
    useUserStore();
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

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
    return <LoadingState />;
  }

  if (!user) {
    return <LoginPrompt />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchProfile} />;
  }

  return (
    <div className="h-[76dvh]  mt-33 2xl:mx-auto px-6 xl:ml-29 lg:ml-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <div className="lg:col-span-2">
            <ProfileInfo
              user={user}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          <div className="lg:col-span-4">
            <div className="transition-all duration-500 ease-in-out">
              {activeTab === "profile" && (
                <ProfileForm
                  profile={user}
                  onUpdate={handleUpdateProfile}
                  loading={updating}
                />
              )}

              {activeTab === "security" && (
                <PasswordForm
                  onChangePassword={handleChangePassword}
                  loading={changingPassword}
                />
              )}
              {activeTab === "appearance" && <AppearanceTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
