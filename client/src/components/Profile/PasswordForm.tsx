import React, { useState } from "react";
import { Button, useToast } from "../../ui";
import type { ChangePasswordRequest } from "../../types/UserProfile";
import { Lock, Eye, EyeOff } from "lucide-react";

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
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const toast = useToast();

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
    setFormError("");
    setFieldErrors({});

    if (!validateForm()) return;

    const result = await onChangePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });

    if (result.success) {
      toast.success("Password changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setFormError(result.error || "Failed to change password");
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

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="bg-gradient-to-br dark:bg-transparent bg-white/80 dark:from-primary-light/10 dark:to-primary-dark/10 backdrop-blur-xl rounded-3xl p-8 border border-white/15 shadow-2xl transition-all duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-400/15 flex items-center justify-center border border-cyan-400/20">
            <Lock className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              Change Password
            </h2>
            <p className="text-light/60 text-sm">
              Secure your account with a new password
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-light/70 mb-3">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              value={formData.currentPassword}
              onChange={handleInputChange("currentPassword")}
              className="w-full bg-white/5 backdrop-blur-lg border outline-none border-white/10 rounded-2xl px-4 py-3 text-white placeholder-light/40 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 pr-12"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-light/40 hover:text-white transition-colors duration-300"
            >
              {showPasswords.current ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {fieldErrors.currentPassword && (
            <p className="text-red-400 text-sm mt-2">
              {fieldErrors.currentPassword}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-light/70 mb-3">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleInputChange("newPassword")}
              className="w-full bg-white/5 backdrop-blur-lg border outline-none border-white/10 rounded-2xl px-4 py-3 text-white placeholder-light/40 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 pr-12"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-light/40 hover:text-white transition-colors duration-300"
            >
              {showPasswords.new ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {fieldErrors.newPassword ? (
            <p className="text-red-400 text-sm mt-2">
              {fieldErrors.newPassword}
            </p>
          ) : (
            <p className="text-light/40 text-sm mt-2">
              Must be at least 6 characters with 1 uppercase letter and 1 number
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-light/70 mb-3">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
              className="w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-light/40 focus:border-cyan-400/50 outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 pr-12"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-light/40 hover:text-white transition-colors duration-300"
            >
              {showPasswords.confirm ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p className="text-red-400 text-sm mt-2">
              {fieldErrors.confirmPassword}
            </p>
          )}
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
            className="bg-gradient-to-r from-cyan-400/90 to-blue-500/50 hover:from-cyan-400/90 hover:to-blue-600/50 text-white py-4 rounded-2xl border-none shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Change Password
          </Button>
        </div>
      </form>
    </div>
  );
};
