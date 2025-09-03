import React, { useState } from "react";
import { Button, TextField } from "../../ui";
import type { ChangePasswordRequest } from "../../types/UserProfile";
import { createFieldChangeHandler } from "../../utils/formUtils";
import { Lock, Key, Shield } from "lucide-react";

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
    <div className="bg-gradient-to-br from-primary-light/10 to-primary-dark/10 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
          <Lock className="w-5 h-5 text-cyan-400" />
        </div>
        <h2 className="text-xl font-semibold text-light/90">Change Password</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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
          startAdornment={<Key className="w-4 h-4 text-light/50" />}
           classes={{
                input:
                  "bg-white/5 backdrop-blur-md border border-white/10 text-light placeholder-light/60 rounded-xl",
                label:
                  "rounded-full text-primary-dark ", 
              }}
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
          startAdornment={<Shield className="w-4 h-4 text-light/50" />}
           classes={{
                input:
                  "bg-white/5 backdrop-blur-md border border-white/10 text-light placeholder-light/60 rounded-xl",
                label:
                  "rounded-full text-primary-dark ", 
              }}
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
          startAdornment={<Lock className="w-4 h-4 text-light/50" />}
           classes={{
                input:
                  "bg-white/5 backdrop-blur-md border border-white/10 text-light placeholder-light/60 rounded-xl",
                label:
                  "rounded-full text-primary-dark ", 
              }}
        />

        {message && (
          <div className="p-3 bg-green-400/10 border border-green-400/20 text-green-400 rounded-lg">
            {message}
          </div>
        )}

        {formError && !Object.values(fieldErrors).some((error) => error) && (
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
          className="bg-cyan-400 hover:bg-cyan-400/90 text-white mt-4 py-3 rounded-xl transition-colors duration-300"
        >
          Change Password
        </Button>
      </form>
    </div>
  );
};
