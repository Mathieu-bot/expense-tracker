import React, { useState } from "react";
import { ProfileForm } from "../components/Profile/ProfileForm";
import { PasswordForm } from "../components/Profile/PasswordForm";
import { ProfileTabNavigation } from "../components/Profile/ProfileTabNavigation";
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
  const [tabTransition, setTabTransition] = useState("");

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

  const handleTabChange = (tab: string) => {
    setTabTransition("fade-out");
    setTimeout(() => {
      setActiveTab(tab);
      setTabTransition("fade-in");
    }, 200);
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
    <div className=" mt-23 ml-20 md:p-8">
      <div className="max-w-6xl mx-auto ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8  min-h-[75dvh]">
          <div className=" h-full flex items-center justify-center">
            <ProfileInfo user={user} />
          </div>
          <div className="lg:col-span-2 pt-5">
            <ProfileTabNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />

            <div
              className={`transition-opacity duration-300 ${
                tabTransition === "fade-out" ? "opacity-0" : "opacity-100"
              }`}
            >
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
