import { useEffect, useState } from "react";
import type React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, useToast, Skeleton } from "../ui";
import { ExpenseService } from "../services/ExpenseService";
import { Loader2 } from "lucide-react";
import { useCategories } from "../hooks/useCategories";
import type { Expense, UpdateExpenseRequest, ExpenseType } from "../types/Expense";
import GlassSelect from "../components/expense/GlassSelect";


export const EditExpense = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { categories, loading: categoriesLoading } = useCategories();

  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  // Local editable copy, synced after expense loads
  const [local, setLocal] = useState<UpdateExpenseRequest>({});

  useEffect(() => {
    const fetchExpense = async () => {
      if (!id) return;
      try {
        setLoading(true);
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
      receipt_url: expense.receipt_url,
    });
  }, [expense]);

  const handleSave = async (form: UpdateExpenseRequest) => {
    if (!id) return;
    try {
      setUpdateLoading(true);
      await ExpenseService.updateExpense(id, form);
      toast.success("Expense updated successfully");
      navigate("/expenses");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update expense";
      toast.error(message);
      throw error;
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/expenses");
  };

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto pt-30">
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

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLocal((f) => ({
      ...f,
      [name]:
        name === "amount" ? (value === "" ? undefined : Number(value)) : value,
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
      receipt_url: local.receipt_url,
    };
    await handleSave(payload);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto pt-20 text-light mt-10">
      <div className="flex items-center mb-6">
        <Button
          onClick={handleCancel}
          className="mr-4 border border-gray-300"
          size="small"
        >
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
            <label className="block text-sm mb-1">Category</label>
            <GlassSelect
              value={local.categoryId ? String(local.categoryId) : null}
              onChange={(v) => setLocal((f) => ({ ...f, categoryId: String(v) }))}
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
            value={local.description || ""}
            onChange={onChange}
            className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                value={local.date?.slice(0, 10) || ""}
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
                  value={local.startDate?.slice(0, 10) || ""}
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
                  value={local.endDate?.slice(0, 10) || ""}
                  onChange={onChange}
                  className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none"
                />
              </div>
            </>
          )}
        </div>

        {local.receipt_url ? (
          <div>
            <label className="block text-xl text-red-600 font-bold mb-1">
              A receipt is already attached
            </label>
            <input
              name="receipt_url"
              type="text"
              value={local.receipt_url || ""}
              onChange={onChange}
              className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none"
            />
          </div>
        ) : null}
        <div>
          <label className="block text-sm mb-1">Receipt (replace)</label>
          <input type="file" onChange={onFile} />
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 justify-end">
          <Button onClick={handleCancel} className="bg-white/15 hover:bg-white/10 border dark:bg-white/10 dark:hover:bg-white/15 dark:border-light/10 border-gray-300">
            Cancel
          </Button>
          <Button onClick={onSubmit}
          className="border-accent/10 text-accent bg-white/80 bg-gradient-to-br from-accent/10 to-accent/20 hover:shadow-lg hover:bg-white/90 dark:bg-accent/10 dark:from-accent/10 dark:to-accent/10 dark:hover:bg-accent/15 dark:border-accent/10 font-semibold">
            {updateLoading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="animate-spin" />
                Saving your expense
              </div>
            ) : (
              "Save Expense"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
