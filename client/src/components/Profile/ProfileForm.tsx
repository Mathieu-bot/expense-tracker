import React, { useState } from "react";
import type {
  UserProfile,
  UpdateProfileRequest,
} from "../../types/UserProfile";
import { Button, TextField } from "../../ui";
import { createFieldChangeHandler } from "../../utils/formUtils";
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
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setFormError("");

    const result = await onUpdate(formData);
    if (result.success) {
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setFormError(result.error || "Failed to update profile");
    }
  };

  const handleFirstNameChange = createFieldChangeHandler(
    setFormData,
    "firstname"
  );
  const handleLastNameChange = createFieldChangeHandler(
    setFormData,
    "lastname"
  );
  const handleUsernameChange = createFieldChangeHandler(
    setFormData,
    "username"
  );

  const clearError = () => {
    if (formError) setFormError("");
  };

  return (
    <div className="bg-gradient-to-br from-primary-light/10 to-primary-dark/10 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <User className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-xl font-semibold text-light/90">
          Profile Information
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TextField
            label="First Name"
            value={formData.firstname}
            onChange={handleFirstNameChange}
            onFocus={clearError}
            placeholder="Enter your first name"
            variant="outlined"
            size="medium"
            fullWidth
             classes={{
                input:
                  "bg-white/5 backdrop-blur-md border border-white/10 text-light placeholder-light/60 rounded-xl",
                label:
                  "rounded-full text-primary-dark ", 
              }}
          />

          <TextField
            label="Last Name"
            value={formData.lastname}
            onChange={handleLastNameChange}
            onFocus={clearError}
            placeholder="Enter your last name"
            variant="outlined"
            size="medium"
            fullWidth

             classes={{
                input:
                  "bg-white/5 backdrop-blur-md border border-white/10 text-light placeholder-light/60 rounded-xl",
                label:
                  "rounded-full text-primary-dark ", 
              }}
          />
        </div>

        <TextField
          label="Username"
          value={formData.username}
          onChange={handleUsernameChange}
          onFocus={clearError}
          placeholder="Enter your username"
          variant="outlined"
          size="medium"
          fullWidth
           classes={{
                input:
                  "bg-white/5 backdrop-blur-md border border-white/10 text-light placeholder-light/60 rounded-xl",
                label:
                  "rounded-full text-primary-dark ", 
              }}
        />

        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-4 h-4 text-cyan-400" />
            <label className="block text-sm font-medium text-light/70">
              Email
            </label>
          </div>
          <div className="px-4 py-3 rounded-lg bg-white/5 text-light/90 border border-white/10">
            {profile.email}
          </div>
          <p className="text-xs text-light/50 mt-2 ml-1">
            Email address cannot be changed
          </p>
        </div>

        {message && (
          <div className="p-3 bg-green-400/10 border border-green-400/20 text-green-400 rounded-lg">
            {message}
          </div>
        )}

        {formError && (
          <div className="p-3 bg-red-400/10 border border-red-400/20 text-red-400 rounded-lg">
            {formError}
          </div>
        )}

        <Button
          type="submit"
          loading={loading}
          loadingPosition="center"
          fullWidth
          size="large"
          className="bg-accent hover:bg-accent/90 text-white mt-4 py-3 rounded-xl transition-colors duration-300"
        >
          Update Profile
        </Button>
      </form>
    </div>
  );
};
