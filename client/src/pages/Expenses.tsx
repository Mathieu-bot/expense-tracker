import { useExpenses } from "../hooks/useExpenses";
import { useCategories } from "../hooks/useCategories";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseItem from "../components/expense/ExpenseItem";
import { Button } from "../ui";
import { GlassDatePicker } from "../components/Income";
import { Calendar, Plus, RefreshCcw, X, List } from "lucide-react";
import GlassSelect from "../components/expense/GlassSelect";

export default function Expenses() {
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [category, setCategory] = useState<string | undefined>();
  const [type, setType] = useState<"one-time" | "recurring" | undefined>();
  const [showFilter, setShowFilter] = useState<boolean>(false);

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
  const { categories, loading: categoriesLoading } = useCategories();
  const navigate = useNavigate();

  const clearFilters = () => {
    setStart(null);
    setEnd(null);
    setCategory(undefined);
    setType(undefined);
  };

  return (
    <div className="relative z-2 mb-10 mt-30 mx-auto text-light max-w-6xl px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Expenses</h1>
          <p className="text-light/90 dark:text-light/60">
            Track your expenses and manage your budget
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="md:col-span-3"></div>
        <Button
          size="large"
          startIcon={<Calendar size={15} />}
          className="px-3 py-2 bg-light/20 border-light/20 hover:bg-light/15 dark:bg-white/5 dark:hover:bg-white/10 border dark:border-white/5 h-full "
          onClick={() => setShowFilter(!showFilter)}
        >
          Filters
        </Button>
        <Button
          onClick={() => navigate("/expenses/new")}
          size="large"
          className="px-3 py-2 rounded-md text-accent bg-white/80 bg-gradient-to-br from-accent/20 to-accent/25 dark:bg-accent/10 dark:hover:bg-accent/15 border border-accent/10 dark:border-accent/10 h-full dark:text-accent text-2xl font-semibold hover:shadow-lg hover:bg-white/90"
          startIcon={<Plus size={15} />}
        >
          New Expense
        </Button>
      </div>

      {showFilter && (
        <div className="p-5 bg-light/20 border-light/10 backdrop-blur-xl border dark:bg-transparent dark:bg-gradient-to-br dark:from-primary-light/10 dark:to-primary-dark/10 dark:border-white/5 rounded-xl mb-5">
          <div className="flex gap-3 mb-5 items-center">
            <div className="text-accent bg-accent/10 flex justify-center items-center p-3 rounded-lg">
              <Calendar size={20}></Calendar>
            </div>
            <h2 className="text-xl font-semibold ">Filters</h2>
          </div>
          <div className="grid grid-col-1 md:grid-cols-5 gap-3">
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
            <GlassSelect
              value={category ?? ""}
              onChange={(v) => setCategory(v === "" ? undefined : String(v))}
              options={[
                { label: "All categories", value: "" },
                ...(categories ?? []).map((c) => ({
                  label: c.category_name,
                  value: String(c.category_id),
                })),
              ]}
              placeholder="Select a category"
              disabled={categoriesLoading}
            />
            <GlassSelect
              value={type ?? ""}
              onChange={(v) =>
                setType(
                  (v || undefined) as "one-time" | "recurring" | undefined
                )
              }
              options={[
                { label: "All types", value: "" },
                { label: "One-time", value: "one-time" },
                { label: "Recurring", value: "recurring" },
              ]}
              placeholder="Select a type"
            />
            <Button
              onClick={clearFilters}
              className="px-3 py-2 rounded-md bg-red-800 border-red-500/20 text-red-400 dark:bg-red-500/20 dark:hover:bg-red-500/25 border dark:border-red-400 h-full dark:text-red-400 dark:active:hover:bg-red-600 dark:active:text-white dark:active:border-red-600"
              startIcon={<X size={15} />}
              size="large"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}

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

      <div className="p-5 border bg-light/20 border-light/10 dark:bg-transparent dark:border-white/5 rounded-xl dark:bg-gradient-to-br dark:from-primary-light/10 dark:to-primary/10 backdrop-blur-2xl">
        <div className="flex mb-5">
          <div className="flex gap-3 items-center">
            <div className="text-green-500 bg-green-500/10 p-3 rounded-lg">
              <List size={20}></List>
            </div>
            <h2 className="text-xl font-semibold">List</h2>
          </div>
          <div className="flex justify-end w-full">
            <Button
              onClick={refetch}
              className="bg-white/80 hover:bg-white/90 hover:shadow-lg bg-gradient-to-br from-accent/10 to-accent/20 border-accent/20 dark:bg-accent/10 dark:hover:bg-accent/15 dark:border-accent/10 text-accent"
              startIcon={<RefreshCcw size={15} />}
            >
              Refresh
            </Button>
          </div>
        </div>
        {!loading && !error && expenses.length > 0 && (
          <ul className="divide-y divide-gray-400 dark:divide-white/10 bg-gradient-to-br from-primary-light/10 to-primary-dark/10 backdrop-blur-xl rounded-2xl border border-white/5 shadow-lg overflow-hidden">
            {expenses.map((e) => (
              <ExpenseItem e={e} refetch={refetch} key={e.expense_id} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
