import React, { useState, useEffect, useRef } from "react";
import type { Income, IncomeFormData } from "../../types/Income";
import { AlertCircle } from "lucide-react";
import { useMascot } from "../../hooks/useMascot";
import { validateIncomeData } from "../../utils/validators";

interface IncomeFormProps {
  income?: Income;
  onSave: (formData: IncomeFormData) => Promise<void>;
  onCancel: () => void;
  open: boolean;
}

interface ErrorDisplay {
  message: string;
  visible: boolean;
}

export const IncomeForm: React.FC<IncomeFormProps> = ({
  income,
  onSave,
  onCancel,
  open,
}) => {
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useMascot();
  const submitRef = useRef<HTMLButtonElement>(null);
  const errorTimeoutRef = useRef<number | null>(null);

  const [formData, setFormData] = useState<IncomeFormData>({
    amount: income?.amount || 0,
    date: income?.date
      ? new Date(income.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    source: income?.source || "",
    description: income?.description || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorDisplay, setErrorDisplay] = useState<ErrorDisplay>({
    message: "",
    visible: false,
  });

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
    setErrorDisplay({ message: "", visible: false });
  }, [income, open]);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const showErrorWithTimeout = (errorMessage: string) => {
    setErrorDisplay({ message: errorMessage, visible: true });

    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    errorTimeoutRef.current = setTimeout(() => {
      setErrorDisplay((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = Number(formData.amount);
    if (isNaN(numericAmount) || numericAmount < 0) {
      showErrorWithTimeout("Amount must be a valid number");
      return;
    }

    const validationErrors = validateIncomeData({
      ...formData,
      amount: numericAmount,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorKey = Object.keys(validationErrors)[0];
      showErrorWithTimeout(validationErrors[firstErrorKey]);
      return;
    }

    setSaving(true);
    try {
      await onSave({ ...formData, amount: numericAmount });
      showSuccess();
    } catch (error) {
      console.error(error);
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

  if (!open) return null;

  return (
    <div className="min-h-screen absolute inset-0 z-[1000] bg-black/40 backdrop-blur-[10px] flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl w-full">
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
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={0.8}
            />

            <foreignObject x={8} y={8} width={84} height={134}>
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className="text-light/50 text-[5px] leading-tight tracking-tight font-light border-none outline-none w-full accent-light/70"
                />

                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => handleChange("source", e.target.value)}
                  className="font-semibold text-light/90 text-[10px] leading-tight truncate border-none outline-none w-full"
                  placeholder="Source"
                />

                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="flex-1 text-light/70 text-[4.5px] leading-snug mb-2 bg-transparent mt-1 outline-none resize-none"
                  placeholder="Add description (Optional)"
                />

                <div className="flex justify-end border-t border-light/10">
                  <input
                    type="text"
                    value={formData.amount.toString()}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    className="text-accent py-2 font-bold text-[11px] leading-none tracking-tight border-none outline-none w-full text-right"
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

        <div className="flex flex-col justify-center items-start p-6">
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
              <p className="text-gray-500 font-medium">
                {formData.source || "Not specified"}
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-100">Amount</label>
              <p className="font-medium text-gray-500">${formData.amount}</p>
            </div>

            <div>
              <label className="text-sm text-gray-100">Date</label>
              <p className="text-gray-500 font-medium">{formData.date}</p>
            </div>

            <div>
              <label className="text-sm text-gray-100">Description</label>
              <p className="text-gray-500 font-medium">
                {formData.description || "No description"}
              </p>
            </div>
          </div>

          {errorDisplay.visible && (
            <div className="mt-6 p-3 bg-red-900/30 border border-red-700/50 rounded-lg w-full max-w-xs animate-fadeIn">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle size={16} />
                <span className="font-medium text-sm">Validation Error</span>
              </div>
              <p className="text-red-300 text-xs mt-1">
                {errorDisplay.message}
              </p>
            </div>
          )}

          <div className="flex gap-4 mt-10">
            <button
              onClick={() => submitRef.current?.click()}
              disabled={saving}
              className="px-6 py-3 bg-primary-light text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Income"}
            </button>

            <button
              onClick={onCancel}
              disabled={saving}
              className="px-6 py-3 bg-gray-100 text-gray-700 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
