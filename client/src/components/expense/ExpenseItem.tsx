import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Expense } from "../../types/Expense";
import { fmt, formatCurrency } from "../../utils/formatters";
import DeleteConfirmationModal from "./ExpenseModals/DeleteConfirmationModal";
import { Edit3, EyeIcon, Trash2 } from "lucide-react";
import { Button } from "../../ui";

type ExpenseListProps = {
  e: Expense;
  refetch: () => Promise<void>;
};

const ExpenseItem = ({ e, refetch }: ExpenseListProps) => {
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      await (
        await import("../../services/ExpenseService")
      ).ExpenseService.deleteExpense(e.expense_id.toString());
      setDeleteOpen(false);
      await refetch();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to delete expense");
    }
  };

  return (
    <>
      <li
        key={e.expense_id}
        className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4 items-center bg-white/5"
      >
        <div className="sm:col-span-2">
          <div className="font-medium text-sm sm:text-base truncate">
            {e.description || e.category?.category_name || "Expense"}
          </div>
          <div className="text-xs sm:text-sm text-light/70">
            {e.type === "one-time" && e.date
              ? fmt(e.date)
              : e.type === "recurring"
              ? `Recurring${e.startDate ? ` from ${fmt(e.startDate)}` : ""}${
                  e.endDate ? ` to ${fmt(e.endDate)}` : ""
                }`
              : ""}
          </div>
        </div>

        <div className="text-light/80 text-xs sm:text-sm">
          {e.category?.category_name ?? `Category #${e.categoryId}`}
        </div>

        <div className="text-right font-semibold text-sm sm:text-base">
          {formatCurrency(e.amount)}
        </div>

        <div className="flex gap-2 justify-end items-center">
          {e.receipt_url ? (
            <a
              href={e.receipt_url}
              target="_blank"
              rel="noreferrer"
              className="aspect-square flex items-center px-2 py-1 text-xs sm:text-sm rounded-md bg-white/10 hover:bg-white/15 border border-white/10"
              title="View receipt"
            >
              <EyeIcon className="size-3" />
            </a>
          ) : null}
          <Button
            onClick={() => navigate(`/expenses/${e.expense_id}/edit`)}
            className="aspect-square px-2 py-1 text-xs sm:text-sm rounded-md bg-white/10 hover:bg-white/15 border border-white/10"
            aria-label="Edit expense"
            size="small"
          >
            <Edit3 className="size-3" />
          </Button>
          <Button
            onClick={() => setDeleteOpen(true)}
            className="text-red-400 aspect-square px-2 py-1 text-xs sm:text-sm rounded-md bg-red-400/20 hover:bg-red-400/30 border border-red-400/30"
            aria-label="Delete expense"
            size="small"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      </li>

      <DeleteConfirmationModal
        open={deleteOpen}
        expense={e}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default ExpenseItem;
