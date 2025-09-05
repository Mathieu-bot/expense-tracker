import React, { useState } from "react";
import { ProfileForm } from "../components/Profile/ProfileForm";
import { PasswordForm } from "../components/Profile/PasswordForm";
import { LoadingState } from "../components/Profile/LoadingState";
import { ErrorState } from "../components/Profile/ErrorState";
import { LoginPrompt } from "../components/Profile/LoginPrompt";
import ProfileInfo from "../components/Profile/ProfileInfo";
import { useUserStore } from "../stores/userStore";
import type {
  ChangePasswordRequest,
  UpdateProfileRequest,
} from "../types/UserProfile";
import { AppearanceTab } from "../components/Profile/Appearance";

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
    <div className="h-[76dvh]  mt-38 ml-15">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ProfileInfo
              user={user}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          <div className="lg:col-span-3">
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
              {activeTab === "appearance" && (
                <AppearanceTab/>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
