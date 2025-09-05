import { useEffect, useState } from "react";
import type React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, useToast, Skeleton } from "../ui";
import { ExpenseService } from "../services/ExpenseService";
import type { Expense, UpdateExpenseRequest, ExpenseType } from "../types/Expense";

export const EditExpense = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  // Local editable copy, synced after expense loads
  const [local, setLocal] = useState<UpdateExpenseRequest>({});

  useEffect(() => {
    const fetchExpense = async () => {
      if (!id) return;
      try {
        const exp = await ExpenseService.getExpenseById(id);
        setExpense(exp);
      } catch {
        toast.error("Failed to load expense");
        navigate("/expenses");
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [id, navigate, toast]);

  // Sync local form when expense changes
  useEffect(() => {
    if (!expense) return;
    setLocal({
      amount: expense.amount,
      description: expense.description ?? undefined,
      type: expense.type as ExpenseType,
      date: expense.date ?? undefined,
      startDate: expense.startDate ?? undefined,
      endDate: expense.endDate ?? undefined,
      categoryId: String(expense.categoryId),
      receipt: undefined,
    });
  }, [expense]);

  const handleSave = async (form: UpdateExpenseRequest) => {
    if (!id) return;
    try {
      await ExpenseService.updateExpense(id, form);
      toast.success("Expense updated successfully");
      navigate("/expenses");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update expense";
      toast.error(message);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate("/expenses");
  };

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto pt-20">
        <Skeleton variant="rect" height={400} rounded="rounded-lg" />
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="p-6 max-w-2xl mx-auto pt-20">
        <div className="text-center text-red-600">Expense not found</div>
      </div>
    );
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocal((f) => ({
      ...f,
      [name]: name === "amount" ? (value === "" ? undefined : Number(value)) : value,
    }));
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setLocal((f) => ({ ...f, receipt: file }));
  };

  const onSubmit = async () => {
    // Client-side validation mirroring server rules
    if (local.type === "one-time" && !local.date) {
      toast.error("Date is required when type is one-time");
      return;
    }
    if (local.type === "recurring" && !local.startDate) {
      toast.error("Start date is required when type is recurring");
      return;
    }
    const payload: UpdateExpenseRequest = {
      amount: local.amount,
      description: local.description,
      type: local.type as ExpenseType,
      date: local.type === "one-time" ? local.date : undefined,
      startDate: local.type === "recurring" ? local.startDate : undefined,
      endDate: local.type === "recurring" ? local.endDate : undefined,
      categoryId: local.categoryId,
      receipt: local.receipt,
    };
    await handleSave(payload);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto pt-20 text-light">
      <div className="flex items-center mb-6">
        <Button onClick={handleCancel} className="mr-4 border border-gray-300" size="small">
          ← Back
        </Button>
        <h1 className="text-2xl font-semibold">Edit Expense</h1>
      </div>

      <div className="bg-white/5 backdrop-blur rounded-lg border border-white/10 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Amount</label>
            <input
              name="amount"
              type="number"
              step="0.01"
              value={local.amount !== undefined ? String(local.amount) : ""}
              onChange={onChange}
              className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Category ID</label>
            <input
              name="categoryId"
              type="text"
              value={local.categoryId || ""}
              onChange={onChange}
              className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Description</label>
          <input
            name="description"
            type="text"
            value={local.description || ""}
            onChange={onChange}
            className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select
              name="type"
              value={local.type}
              onChange={onChange}
              className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none"
            >
              <option value="one-time">One-time</option>
              <option value="recurring">Recurring</option>
            </select>
          </div>
          {local.type === "one-time" && (
            <div>
              <label className="block text-sm mb-1">Date</label>
              <input
                name="date"
                type="date"
                value={local.date || ""}
                onChange={onChange}
                required
                className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none"
              />
            </div>
          )}
          {local.type === "recurring" && (
            <>
              <div>
                <label className="block text-sm mb-1">Start Date</label>
                <input
                  name="startDate"
                  type="date"
                  value={local.startDate || ""}
                  onChange={onChange}
                  required
                  className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">End Date</label>
                <input
                  name="endDate"
                  type="date"
                  value={local.endDate || ""}
                  onChange={onChange}
                  className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none"
                />
              </div>
            </>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Receipt (replace)</label>
          <input type="file" onChange={onFile} />
        </div>

        <div className="flex gap-3 justify-end">
          <Button onClick={handleCancel} className="border border-gray-300">
            Cancel
          </Button>
          <Button onClick={onSubmit}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};
