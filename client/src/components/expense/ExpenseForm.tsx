import { useCallback, useMemo, useState } from "react";
import { Button, DatePicker } from "../../ui";
import type { ExpenseType, CreateExpenseRequest, UpdateExpenseRequest } from "../../types/Expense";
import AmountField from "./fields/AmountField";
import CategoryField from "./fields/CategoryField";
import DescriptionField from "./fields/DescriptionField";
import TypeField from "./fields/TypeField";
import RecurringDatesField from "./fields/RecurringDatesField";

export type ExpenseFormValues = {
  amount: string | number;
  description?: string;
  type: ExpenseType;
  date?: string;
  startDate?: string;
  endDate?: string;
  categoryId: string;
  receipt?: File;
};

export type ExpenseFormProps = {
  mode?: "create" | "edit";
  initial: ExpenseFormValues;
  submitting?: boolean;
  onSubmit: (values: ExpenseFormValues) => Promise<void> | void;
  onCancel: () => void;
};

export default function ExpenseForm({ mode = "create", initial, onSubmit, onCancel, submitting }: ExpenseFormProps) {

  const [form, setForm] = useState<ExpenseFormValues>({ ...initial });
  const [saving, setSaving] = useState(false);
  const busy = saving || !!submitting;

  const isRecurring = form.type === "recurring";

  const toDate = (s?: string) => (s ? new Date(s) : null);
  const fmt = (d: Date | null) => (d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` : "");

  const validate = useCallback((): string | null => {
    if (!form.amount) return "Amount is required";
    if (!form.categoryId) return "Category is required";
    if (form.type === "one-time") {
      if (!form.date) return "Date is required for one-time expense";
    } else if (form.type === "recurring") {
      if (!form.startDate) return "Start date is required for recurring expense";
    }
    return null;
  }, [form]);

  const payload = useMemo(() => {
    const base = {
      amount: form.amount,
      description: form.description || undefined,
      type: form.type as ExpenseType,
      categoryId: form.categoryId,
      receipt: form.receipt,
    };
    if (form.type === "one-time") {
      return {
        ...base,
        date: form.date || undefined,
      } as CreateExpenseRequest | UpdateExpenseRequest;
    }
    return {
      ...base,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
    } as CreateExpenseRequest | UpdateExpenseRequest;
  }, [form]);

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      // Consumers (pages) show toasts; here we can throw to be caught by parent if needed
      throw new Error(err);
    }
    try {
      setSaving(true);
      // Cast payload to the form value shape for consumers
      await onSubmit(payload as ExpenseFormValues);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur rounded-lg border border-white/10 p-6 space-y-4 text-light">
      <div className="grid grid-cols-2 gap-4">
        <AmountField value={form.amount} onChange={(v) => setForm((f) => ({ ...f, amount: v }))} />
        <CategoryField value={form.categoryId} onChange={(v) => setForm((f) => ({ ...f, categoryId: v }))} />
      </div>

      <div>
        <DescriptionField value={form.description || ""} onChange={(v) => setForm((f) => ({ ...f, description: v }))} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <TypeField value={form.type} onChange={(v) => setForm((f) => ({ ...f, type: v }))} />
        {form.type === "one-time" && (
          <div>
            <label className="block text-sm mb-1">Date</label>
            <DatePicker
              value={toDate(form.date)}
              onChange={(d) => setForm((f) => ({ ...f, date: fmt(d) }))}
              classes={{
                root: "w-full",
                input:
                  "!bg-transparent !border-none !outline-none !ring-0 focus:!ring-0 !shadow-none text-white dark:text-light/50 !font-semibold text-sm w-full",
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
          </div>
        )}
        {isRecurring && (
          <RecurringDatesField
            startDate={form.startDate}
            endDate={form.endDate}
            onChangeStart={(v) => setForm((f) => ({ ...f, startDate: v }))}
            onChangeEnd={(v) => setForm((f) => ({ ...f, endDate: v }))}
          />
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Receipt (optional)</label>
        <input type="file" onChange={(e) => {
          const file = e.target.files?.[0];
          setForm((f) => ({ ...f, receipt: file }));
        }} />
      </div>

      <div className="flex gap-3 justify-end">
        <Button onClick={onCancel} className="border border-gray-300" disabled={busy}>
          Cancel
        </Button>
        <Button onClick={() => void handleSubmit()} loading={busy}>
          {mode === "create" ? "Save Expense" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
