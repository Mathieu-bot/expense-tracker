import { useNavigate } from "react-router-dom";
import type { Expense } from "../../types/Expense";
import { fmt, formatCurrency } from "../../utils/formatters";

type ExpenseListProps = {
  e: Expense;
  refetch: () => Promise<void>;
};

const ExpenseItem = ({ e, refetch }: ExpenseListProps) => {
  const navigate = useNavigate();
  return (
    <li key={e.expense_id} className="p-4 grid grid-cols-5 gap-4 items-center">
      <div className="col-span-2">
        <div className="font-medium">
          {e.description || e.category?.category_name || "Expense"}
        </div>
        <div className="text-sm text-light/70">
          {e.type === "one-time" && e.date
            ? fmt(e.date)
            : e.type === "recurring"
            ? `Recurring${e.startDate ? ` from ${fmt(e.startDate)}` : ""}${
                e.endDate ? ` to ${fmt(e.endDate)}` : ""
              }`
            : ""}
        </div>
      </div>
      <div className="text-light/80">
        {e.category?.category_name ?? `Category #${e.categoryId}`}
      </div>
      <div className="text-right font-semibold">{formatCurrency(e.amount)}</div>
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
              await (
                await import("../../services/ExpenseService")
              ).ExpenseService.deleteExpense(e.expense_id.toString());
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
  );
};

export default ExpenseItem;
