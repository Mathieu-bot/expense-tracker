import { useExpenses } from "../hooks/useExpenses";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseItem from "../components/expense/ExpenseItem";
import { Button} from "../ui";
import { GlassDatePicker } from "../components/Income";
import { Plus, RefreshCcw } from "lucide-react";

export default function Expenses() {
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [category, setCategory] = useState<string | undefined>();
  const [type, setType] = useState<"one-time" | "recurring" | undefined>();

  const fmt = (d: Date | null) =>
    d
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`
      : undefined;

  const { expenses, loading, error, refetch } = useExpenses(
    fmt(start),
    fmt(end),
    category,
    type
  );
  const navigate = useNavigate();

  return (
    <div className="relative z-2 mb-10 mt-30 mx-auto text-light max-w-6xl px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Expenses</h1>
          <p className="text-light/60">
            Track your expenses and manage your budget
          </p>
        </div>
        <Button
          onClick={refetch}
          className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 border border-white/10 h-full"
          startIcon={<RefreshCcw size={15} />}
        >
          Refresh
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <GlassDatePicker
          value={start}
          onChange={setStart}
          placeholder="Start date"
        />
        <GlassDatePicker
          value={end}
          onChange={setEnd}
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
            setType(
              (e.target.value || undefined) as
                | "one-time"
                | "recurring"
                | undefined
            )
          }
          className="rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none"
        >
          <option value="">All types</option>
          <option value="one-time">One-time</option>
          <option value="recurring">Recurring</option>
        </select>
        <Button
          onClick={() => navigate("/expenses/new")}
          size="large"
          className="px-3 py-2 rounded-md bg-accent/20 hover:bg-accent/30 border border-accent/30 h-full text-accent text-2xl font-semibold"
          startIcon={<Plus size={15} />}
        >
          New Expense
        </Button>
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
            <ExpenseItem e={e} refetch={refetch} key={e.expense_id} />
          ))}
        </ul>
      )}
    </div>
  );
}
