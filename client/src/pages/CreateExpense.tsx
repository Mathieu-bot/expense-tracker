import { useState } from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { Button, useToast, Select } from "../ui";
import { ExpenseService } from "../services/ExpenseService";
import { useCategories } from "../hooks/useCategories";
import type { CreateExpenseRequest, ExpenseType } from "../types/Expense";

export const CreateExpense = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { categories, loading: categoriesLoading } = useCategories();

  const [form, setForm] = useState<CreateExpenseRequest>({
    amount: "",
    description: "",
    type: "one-time",
    date: "",
    startDate: "",
    endDate: "",
    categoryId: "",
    receipt: undefined,
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // const buffer = await file?.arrayBuffer();
    // const bytes = new Uint8Array(buffer!);

    // const blob = new Blob([bytes], { type: file?.type });
    // const fileBlob = new File([blob], "test", { type: blob?.type });

    // const url = URL.createObjectURL(fileBlob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = file!.name;
    // a.click();
    setForm((f) => ({ ...f, receipt: file }));
  };

  const validate = (): string | null => {
    if (!form.amount) return "Amount is required";
    if (!form.categoryId) return "Category is required";
    if (!/^\d+$/.test(String(form.categoryId))) return "Invalid category selection";
    if ((form.type as ExpenseType) === "one-time") {
      if (!form.date) return "Date is required for one-time expense";
    } else if ((form.type as ExpenseType) === "recurring") {
      if (!form.startDate)
        return "Start date is required for recurring expense";
    }
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    try {
      await ExpenseService.createExpense({
        amount: form.amount,
        description: form.description || undefined,
        type: (form.type as ExpenseType) || undefined,
        date: form.type === "one-time" ? form.date || undefined : undefined,
        startDate:
          form.type === "recurring" ? form.startDate || undefined : undefined,
        endDate:
          form.type === "recurring" ? form.endDate || undefined : undefined,
        categoryId: form.categoryId,
        receipt: form.receipt,
      });
      toast.success("Expense created successfully");
      navigate("/expenses");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create expense";
      toast.error(message);
    }
  };

  const handleCancel = () => {
    navigate("/expenses");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto pt-20 text-light">
      <div className="flex items-center mb-6">
        <Button
          onClick={handleCancel}
          className="mr-4 border border-gray-300"
          size="small"
        >
          ← Back
        </Button>
        <h1 className="text-2xl font-semibold">Create New Expense</h1>
      </div>

      <div className="bg-white/5 backdrop-blur rounded-lg border border-white/10 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Amount</label>
            <input
              name="amount"
              type="number"
              step="0.01"
              value={form.amount}
              onChange={onChange}
              className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Category</label>
            <Select
              value={form.categoryId || null}
              onChange={(v) => setForm((f) => ({ ...f, categoryId: String(v) }))}
              options={categories.map((c) => ({ label: c.category_name, value: String(c.category_id) }))}
              placeholder="Select a category"
              disabled={categoriesLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Description</label>
          <input
            name="description"
            type="text"
            value={form.description || ""}
            onChange={onChange}
            className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none"
            placeholder="Optional"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={onChange}
              className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none"
            >
              <option value="one-time">One-time</option>
              <option value="recurring">Recurring</option>
            </select>
          </div>
          {form.type === "one-time" && (
            <div>
              <label className="block text-sm mb-1">Date</label>
              <input
                name="date"
                type="date"
                value={form.date || ""}
                onChange={onChange}
                className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none"
              />
            </div>
          )}
          {form.type === "recurring" && (
            <>
              <div>
                <label className="block text-sm mb-1">Start Date</label>
                <input
                  name="startDate"
                  type="date"
                  value={form.startDate || ""}
                  onChange={onChange}
                  className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">End Date</label>
                <input
                  name="endDate"
                  type="date"
                  value={form.endDate || ""}
                  onChange={onChange}
                  className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none"
                />
              </div>
            </>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Receipt (optional)</label>
          <input type="file" onChange={onFile} />
        </div>

        <div className="flex gap-3 justify-end">
          <Button onClick={handleCancel} className="border border-gray-300">
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Expense</Button>
        </div>
      </div>
    </div>
  );
};
