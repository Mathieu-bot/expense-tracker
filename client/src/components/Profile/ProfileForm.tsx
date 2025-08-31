import React, { useState } from "react";
import type {
  UserProfile,
  UpdateProfileRequest,
} from "../../types/UserProfile";
import { Button, TextField } from "../../ui";
import { createFieldChangeHandler } from "../../utils/formUtils";

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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Profile Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="First Name"
            value={formData.firstname}
            onChange={handleFirstNameChange}
            onFocus={clearError}
            placeholder="Enter your first name"
            variant="outlined"
            size="medium"
            fullWidth
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
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-600 border border-gray-300">
            {profile.email}
          </div>
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        {message && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {message}
          </div>
        )}

        {formError && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {formError}
          </div>
        )}

        <Button
          type="submit"
          loading={loading}
          loadingPosition="center"
          fullWidth
          size="large"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Update Profile
        </Button>
      </form>
    </div>
  );
};
