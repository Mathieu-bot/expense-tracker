import React, { useState, useEffect, useRef } from "react";
import type { Income, IncomeFormData } from "../../types/Income";
import { useMascot } from "../../hooks/useMascot";
import { validateIncomeData } from "../../utils/validators";
import { DatePicker, useToast } from "../../ui";
import { useTheme } from "../../contexts/ThemeContext";

interface IncomeFormProps {
  income?: Income;
  onSave: (formData: IncomeFormData) => Promise<void>;
  onCancel: () => void;
  open: boolean;
}

export const IncomeForm: React.FC<IncomeFormProps> = ({
  income,
  onSave,
  onCancel,
  open,
}) => {
  const { isDark } = useTheme();
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useMascot();
  const { error: toastError } = useToast();
  const submitRef = useRef<HTMLButtonElement>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState<IncomeFormData>({
    amount: income?.amount || 0,
    date: income?.date
      ? new Date(income.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    source: income?.source || "",
    description: income?.description || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (income) {
      setFormData({
        amount: income.amount,
        date: new Date(income.date).toISOString().split("T")[0],
        source: income.source,
        description: income.description || "",
      });
    } else {
      setFormData({
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        source: "",
        description: "",
      });
    }
    setErrors({});
    setHasChanges(false);
  }, [income, open]);

  useEffect(() => {
    if (!income) {
      setHasChanges(true);
      return;
    }

    const hasFormChanged =
      formData.amount !== income.amount ||
      formData.date !== new Date(income.date).toISOString().split("T")[0] ||
      formData.source !== income.source ||
      formData.description !== (income.description || "");

    setHasChanges(hasFormChanged);
  }, [formData, income]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasChanges) {
      return;
    }

    const numericAmount = Number(formData.amount);
    if (isNaN(numericAmount) || numericAmount < 0) {
      toastError("Amount must be a valid number");
      return;
    }

    const validationErrors = validateIncomeData({
      ...formData,
      amount: numericAmount,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorKey = Object.keys(validationErrors)[0];
      toastError(validationErrors[firstErrorKey]);
      return;
    }

    setSaving(true);
    try {
      await onSave({ ...formData, amount: numericAmount });
      showSuccess();
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Failed to save income";
      toastError(message);
      showError();
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    field: keyof IncomeFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const dateString = new Date(date).toISOString().split("T")[0];
      handleChange("date", dateString);
    }
  };

  if (!open) return null;

  return (
    <div className="min-h-screen md:pt-8 pt-30 lg:pt-5 inset-0 z-[1000] bg-black/40 backdrop-blur-[10px] flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-3xl w-full">
        <div className="relative flex items-center justify-center">
          <svg
            viewBox="0 0 100 150"
            preserveAspectRatio="none"
            className="h-[70vh] max-h-[600px]"
          >
            <path
              d="
                M 10,0
                H 90
                Q 100,0 100,10
                V 140
                L 87.5,148
                L 75,140
                L 62.5,148
                L 50,140
                L 37.5,148
                L 25,140
                L 12.5,148
                L 0,140
                V 10
                Q 0,0 10,0
              "
              fill={`${
                isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)"
              }`}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={0.8}
            />

            <foreignObject x={8} y={8} width={84} height={134}>
              <form onSubmit={handleSubmit} className="flex flex-col h-full mt-1">
                <DatePicker
                  value={formData.date ? new Date(formData.date) : null}
                  onChange={handleDateChange}
                  classes={{
                    root: "w-full",
                    input:
                      "!bg-transparent !border-none !outline-none !ring-0 focus:!ring-0 !shadow-none text-white dark:text-light/50 !font-semibold text-[5px] font-light w-full !p-0",
                    label: "hidden",
                    calendar:
                      "dark:bg-white/10 dark:backdrop-blur-xl rounded-2xl p-3 border border-white/10 shadow-lg",
                    nav: "flex justify-between items-center p-2 border-b border-gray-700",
                    grid: "grid grid-cols-7 gap-1 p-2",
                    day: "dark:text-light/80 hover:bg-white/10 rounded-lg transition-colors border-none",
                    daySelected: "bg-blue-500 text-white",
                    dayDisabled: "text-gray-500 cursor-not-allowed",
                  }}
                />

                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => handleChange("source", e.target.value)}
                  className="font-semibold mt-1 text-white dark:text-light/90 text-[10px] leading-tight truncate border-none outline-none w-full"
                  placeholder="Source"
                />

                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="flex-1 text-white dark:text-light/70 text-[4.5px] leading-snug mb-2 bg-transparent mt-1 outline-none resize-none"
                  placeholder="Add description (Optional)"
                />

                <div className="flex mb-1 justify-end border-t border-light/10">
                  <input
                    type="text"
                    value={formData.amount.toString()}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    className="text-[#ffdd33] py-2 font-bold text-[11px] leading-none tracking-tight border-none outline-none w-full text-right"
                    placeholder="Amount"
                  />
                </div>

                <button ref={submitRef} type="submit" className="hidden">
                  Submit
                </button>
              </form>
            </foreignObject>
          </svg>
        </div>

        <div className="w-full flex items-center justify-center">
          <div className="flex flex-col w-fit justify-center items-start p-6">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-100 mb-2">
                {income ? "Edit Income" : "New Income"}
              </h2>
              <p className="text-gray-100">
                Fill out your income details on the receipt
              </p>
            </div>

            <div className="space-y-4 w-full max-w-xs">
              <div>
                <label className="text-sm text-gray-100">Source</label>
                <p className="text-[#ffdd33] dark:text-gray-500 font-medium">
                  {formData.source || "-"}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-100">Amount</label>
                <p className="font-medium text-[#ffdd33] dark:text-gray-500">
                  ${formData.amount}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-100">Date</label>
                <p className="text-[#ffdd33] dark:text-gray-500 font-medium">
                  {formData.date}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-100">Description</label>
                <p className="text-[#ffdd33] dark:text-gray-500 font-medium">
                  {formData.description || "-"}
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => submitRef.current?.click()}
                disabled={saving || (!hasChanges && !!income)}
                className={`px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 border-none ${
                  saving || (!hasChanges && !!income)
                    ? "bg-gray-400/50 text-gray-200 cursor-not-allowed"
                    : "bg-gradient-to-br from-green-400/25 to-green-400/20 bg-white/80 text-green-700/80 dark:bg-none dark:bg-primary-light dark:text-white font-semibold"
                }`}
              >
                {saving
                  ? "Saving..."
                  : income
                  ? "Save Changes"
                  : "Create Income"}
              </button>

              <button
                onClick={onCancel}
                disabled={saving}
                className="px-6 py-3 bg-gray-100 text-gray-700 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>

            {!hasChanges && income && (
              <p className="text-gray-400 text-sm mt-4">
                No changes made to the income
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
