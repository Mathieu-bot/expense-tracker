import React, { useState, useEffect } from "react";
import type { Income, IncomeFormData } from "../types/Income";
import { useIncomeCategories } from "../hooks/useIncomeCategories";
import { Button, TextField, Select, Dialog, Skeleton } from "../ui";
import { useMascot } from "../hooks/useMascot";

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
  const { categories, loading: categoriesLoading } = useIncomeCategories();
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useMascot();

  const [formData, setFormData] = useState<IncomeFormData>({
    amount: income?.amount || 0,
    date: income?.date
      ? new Date(income.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    source: income?.source || "",
    description: income?.description || "",
    category_id: income?.category_id || 1,
  });

  useEffect(() => {
    if (income) {
      setFormData({
        amount: income.amount,
        date: new Date(income.date).toISOString().split("T")[0],
        source: income.source,
        description: income.description || "",
        category_id: income.category_id,
      });
    } else {
      setFormData({
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        source: "",
        description: "",
        category_id: 1,
      });
    }
  }, [income, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      [field]:
        field === "amount" || field === "category_id" ? Number(value) : value,
    }));
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
        />

        <TextField
          label="Date"
          type="date"
          value={formData.date ?? ""}
          onChange={(e) => handleChange("date", e.target.value)}
          fullWidth
        />

        <TextField
          label="Source"
          value={formData.source ?? ""}
          onChange={(e) => handleChange("source", e.target.value)}
          fullWidth
        />

        {categoriesLoading ? (
          <Skeleton variant="rect" height={56} rounded="rounded-md" />
        ) : (
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Category
            </label>
            <Select
              value={formData.category_id ?? null}
              onChange={(value) => handleChange("category_id", value)}
              options={categories.map((cat) => ({
                label: cat.category_name,
                value: cat.category_id,
              }))}
            />
          </div>
        )}

        <TextField
          label="Description"
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          fullWidth
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
