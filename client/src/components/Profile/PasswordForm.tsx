import React, { useState } from "react";
import { Button, TextField } from "../../ui";
import type { ChangePasswordRequest } from "../../types/UserProfile";
import { createFieldChangeHandler } from "../../utils/formUtils";

interface PasswordFormProps {
  onChangePassword: (
    data: ChangePasswordRequest
  ) => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
}

export const PasswordForm: React.FC<PasswordFormProps> = ({
  onChangePassword,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (formData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters long";
    } else if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
      errors.newPassword =
        "Password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(formData.newPassword)) {
      errors.newPassword = "Password must contain at least one number";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setFormError("");
    setFieldErrors({});

    if (!validateForm()) return;

    const result = await onChangePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });

    if (result.success) {
      setMessage("Password changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setMessage(""), 3000);
    } else {
      const error = result.error || "Failed to change password";
      setFormError(error);

      if (
        error.toLowerCase().includes("current") ||
        error.toLowerCase().includes("incorrect")
      ) {
        setFieldErrors((prev) => ({ ...prev, currentPassword: error }));
      } else if (
        error.toLowerCase().includes("new") ||
        error.toLowerCase().includes("password")
      ) {
        if (
          error.toLowerCase().includes("uppercase") ||
          error.toLowerCase().includes("number") ||
          error.toLowerCase().includes("6") ||
          error.toLowerCase().includes("character")
        ) {
          setFieldErrors((prev) => ({ ...prev, newPassword: error }));
        } else {
          setFormError(error);
        }
      } else {
        setFormError(error);
      }
    }
  };

  const handleCurrentPasswordChange = createFieldChangeHandler(
    setFormData,
    "currentPassword"
  );
  const handleNewPasswordChange = createFieldChangeHandler(
    setFormData,
    "newPassword"
  );
  const handleConfirmPasswordChange = createFieldChangeHandler(
    setFormData,
    "confirmPassword"
  );

  const clearFieldError = (fieldName: string) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
    if (formError) setFormError("");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Current Password"
          type="password"
          value={formData.currentPassword}
          onChange={handleCurrentPasswordChange}
          onFocus={() => clearFieldError("currentPassword")}
          placeholder="Enter current password"
          variant="outlined"
          size="medium"
          fullWidth
          error={!!fieldErrors.currentPassword}
          helperText={fieldErrors.currentPassword}
        />

        <TextField
          label="New Password"
          type="password"
          value={formData.newPassword}
          onChange={handleNewPasswordChange}
          onFocus={() => clearFieldError("newPassword")}
          placeholder="Enter new password"
          variant="outlined"
          size="medium"
          fullWidth
          error={!!fieldErrors.newPassword}
          helperText={
            fieldErrors.newPassword ||
            "Must be at least 6 characters with 1 uppercase letter and 1 number"
          }
        />

        <TextField
          label="Confirm New Password"
          type="password"
          value={formData.confirmPassword}
          onChange={handleConfirmPasswordChange}
          onFocus={() => clearFieldError("confirmPassword")}
          placeholder="Confirm new password"
          variant="outlined"
          size="medium"
          fullWidth
          error={!!fieldErrors.confirmPassword}
          helperText={fieldErrors.confirmPassword}
        />

        {message && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {message}
          </div>
        )}

        {formError && !Object.values(fieldErrors).some((error) => error) && (
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
          Change Password
        </Button>
      </form>
    </div>
  );
};
