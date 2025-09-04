import { useExpenses } from "../hooks/useExpenses";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function fmt(dateStr?: string | null) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

export default function Expenses() {
  const [start, setStart] = useState<string | undefined>();
  const [end, setEnd] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const [type, setType] = useState<"one-time" | "recurring" | undefined>();

  const { expenses, loading, error, refetch } = useExpenses(
    start,
    end,
    category,
    type
  );
  const navigate = useNavigate();

  return (
    <div className="relative z-2 mb-10 mt-30 mx-auto text-light max-w-6xl px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Expenses</h1>
        <button
          onClick={refetch}
          className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 border border-white/10"
        >
          Refresh
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input
          type="date"
          value={start ?? ""}
          onChange={(e) => setStart(e.target.value || undefined)}
          className="rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none"
          placeholder="Start date"
        />
        <input
          type="date"
          value={end ?? ""}
          onChange={(e) => setEnd(e.target.value || undefined)}
          className="rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none"
          placeholder="End date"
        />
        <input
          type="text"
          value={category ?? ""}
          onChange={(e) => setCategory(e.target.value || undefined)}
          className="rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none"
          placeholder="Category name"
        />
        <select
          value={type ?? ""}
          onChange={(e) =>
            setType((e.target.value || undefined) as "one-time" | "recurring" | undefined)
          }
          className="rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none"
        >
          <option value="">All types</option>
          <option value="one-time">One-time</option>
          <option value="recurring">Recurring</option>
        </select>
        <button
          onClick={() => navigate("/expenses/new")}
          className="px-3 py-2 rounded-md bg-accent/20 hover:bg-accent/30 border border-accent/30"
        >
          New Expense
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="size-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
        </div>
      )}

      {error && (
        <div className="text-red-400 bg-red-400/10 border border-red-400/30 p-3 rounded-md">
          {error}
        </div>
      )}

      {!loading && !error && expenses.length === 0 && (
        <div className="text-light/70">No expenses found.</div>
      )}

      {!loading && !error && expenses.length > 0 && (
        <ul className="divide-y divide-white/10 bg-gradient-to-br from-primary-light/10 to-primary-dark/10 backdrop-blur-xl rounded-2xl border border-white/5 shadow-lg overflow-hidden">
          {expenses.map((e) => (
            <li key={e.expense_id} className="p-4 grid grid-cols-5 gap-4 items-center">
              <div className="col-span-2">
                <div className="font-medium">
                  {e.description || e.category?.category_name || "Expense"}
                </div>
                <div className="text-sm text-light/70">
                  {e.type === "one-time" && e.date
                    ? fmt(e.date)
                    : e.type === "recurring"
                    ? `Recurring${e.startDate ? ` from ${fmt(e.startDate)}` : ""}${e.endDate ? ` to ${fmt(e.endDate)}` : ""}`
                    : ""}
                </div>
              </div>
              <div className="text-light/80">
                {e.category?.category_name ?? `Category #${e.categoryId}`}
              </div>
              <div className="text-right font-semibold">{e.amount.toFixed(2)}</div>
              <div className="flex gap-2 justify-end">
                {e.receipt_upload ? (
                  <a
                    href={e.receipt_upload}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-1 text-xs rounded-md bg-white/10 hover:bg-white/15 border border-white/10"
                  >
                    View receipt
                  </a>
                ) : null}
                <button
                  onClick={() => navigate(`/expenses/${e.expense_id}/edit`)}
                  className="px-2 py-1 text-xs rounded-md bg-white/10 hover:bg-white/15 border border-white/10"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (!confirm("Delete this expense?")) return;
                    try {
                      await (await import("../services/ExpenseService")).ExpenseService.deleteExpense(
                        e.expense_id.toString()
                      );
                      await refetch();
                    } catch (err) {
                      console.error(err);
                      alert(
                        err instanceof Error ? err.message : "Failed to delete expense"
                      );
                    }
                  }}
                  className="px-2 py-1 text-xs rounded-md bg-red-400/20 hover:bg-red-400/30 border border-red-400/30"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
