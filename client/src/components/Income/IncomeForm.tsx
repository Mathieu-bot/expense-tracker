import React, { useState, useEffect } from "react";
import type { Income, IncomeFormData } from "../../types/Income";
import { Button, TextField, Dialog, DatePicker } from "../../ui";
import { useMascot } from "../../hooks/useMascot";
import { validateIncomeData } from "../../utils/validators";

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
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useMascot();

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
  }, [income, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateIncomeData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
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
      [field]: field === "amount" ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      handleChange("date", formattedDate);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={income ? "Edit Income" : "Add New Income"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Amount"
          type="number"
          value={(formData.amount ?? 0).toString()}
          onChange={(e) => handleChange("amount", e.target.value)}
          required
          fullWidth
          min={0}
          error={!!errors.amount}
          helperText={errors.amount}
        />

        <DatePicker
          value={formData.date ? new Date(formData.date) : new Date()}
          onChange={handleDateChange}
          label="Date"
          size="medium"
          required
        />

        <TextField
          label="Source"
          value={formData.source ?? ""}
          onChange={(e) => handleChange("source", e.target.value)}
          fullWidth
          error={!!errors.source}
          helperText={errors.source}
        />

        <TextField
          label="Description"
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          fullWidth
          error={!!errors.description}
          helperText={errors.description}
        />

        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            onClick={onCancel}
            className="border border-gray-300"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving} loading={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
