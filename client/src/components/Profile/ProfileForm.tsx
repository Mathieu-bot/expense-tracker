import React, { useState, useEffect } from "react";
import type {
  UserProfile,
  UpdateProfileRequest,
} from "../../types/UserProfile";
import { Button, useToast } from "../../ui";
import { User, Mail } from "lucide-react";
interface ProfileFormProps {
  profile: UserProfile;
  onUpdate: (
    data: UpdateProfileRequest
  ) => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onUpdate,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    firstname: profile.firstname || "",
    lastname: profile.lastname || "",
    username: profile.username || "",
  });
  const [formError, setFormError] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  useEffect(() => {
    const hasFormChanged =
      formData.firstname !== profile.firstname ||
      formData.lastname !== profile.lastname ||
      formData.username !== profile.username;

    setHasChanges(hasFormChanged);
  }, [formData, profile]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!validateForm()) return;

    const result = await onUpdate(formData);
    if (result.success) {
      toast.success("Profile updated successfully!");
    } else {
      setFormError(result.error || "Failed to update profile");
    }
  };

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (fieldErrors[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: "" }));
      }
      if (formError) setFormError("");
    };

  return (
    <div className="bg-gradient-to-br from-primary-light/10 to-primary-dark/10 backdrop-blur-xl rounded-3xl p-8 border border-white/15 shadow-2xl transition-all duration-500 hover:shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center border border-accent/20">
            <User className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              Profile Information
            </h2>
            <p className="text-light/60 text-sm">
              Update your personal details
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-light/70 mb-3">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstname}
              onChange={handleInputChange("firstname")}
              className="w-full bg-white/5 backdrop-blur-lg outline-none border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-light/40 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all duration-300"
              placeholder="Enter your first name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light/70 mb-3">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastname}
              onChange={handleInputChange("lastname")}
              className="w-full bg-white/5 backdrop-blur-lg outline-none border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-light/40 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all duration-300"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-light/70 mb-3">
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={handleInputChange("username")}
            className={`w-full bg-white/5 backdrop-blur-lg outline-none border rounded-2xl px-4 py-3 text-white placeholder-light/40 focus:ring-2 focus:ring-accent/20 transition-all duration-300 ${
              fieldErrors.username
                ? "border-red-400/50 focus:border-red-400/50"
                : "border-white/10 focus:border-accent/50"
            }`}
            placeholder="Enter your username"
          />
          {fieldErrors.username && (
            <p className="text-red-400 text-sm mt-2">{fieldErrors.username}</p>
          )}
        </div>

        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="w-5 h-5 text-blue-400" />
            <label className="block text-sm font-medium text-light/70">
              Email
            </label>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 text-white">
            {profile.email}
          </div>
          <p className="text-xs text-light/50 mt-2">
            Email address cannot be changed
          </p>
        </div>

        {formError && (
          <div className="p-4 bg-red-400/15 border border-red-400/30 text-red-400 rounded-2xl backdrop-blur-lg">
            {formError}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            loading={loading}
            disabled={!hasChanges || loading}
            className={`bg-gradient-to-r text-white py-4 rounded-2xl border-none shadow-lg hover:shadow-xl transition-all duration-300 ${
              !hasChanges || loading
                ? "from-gray-400/30 to-gray-400/10 cursor-not-allowed text-gray-400"
                : "from-accent/60 to-accent/20 hover:from-accent/50 hover:accent/10"
            }`}
          >
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  );
};
