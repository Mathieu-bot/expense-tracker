import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { Expense } from "../../../types/Expense";
import { fmt, formatCurrency } from "../../../utils/formatters";

interface DeleteConfirmationModalProps {
  open: boolean;
  expense: Expense | null;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export const DeleteConfirmationModal: React.FC<
  DeleteConfirmationModalProps
> = ({ open, expense, onClose, onConfirm }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  const content = (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className="bg-primary/60 border border-gray-700 rounded-xl shadow-2xl w-full max-w-[95vw] sm:max-w-md md:max-w-lg z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-4 sm:p-5 border-b border-gray-700">
          <h3 className="text-red-600 font-bold text-lg sm:text-xl">
            Confirm Delete
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 sm:p-5 text-gray-200">
          <p className="mb-2 text-sm">
            Are you sure you want to delete this expense?
          </p>
          <p className="mb-3 text-sm text-gray-300">
            This action cannot be undone.
          </p>
          {expense && (
            <div className="mt-2 p-3 sm:p-4 bg-gray-950/40 border border-gray-700 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Amount</p>
                  <p className="text-red-600 font-medium text-sm sm:text-base">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Date</p>
                  <p className="text-gray-200 text-sm">
                    {expense.type === "one-time"
                      ? expense.date
                        ? fmt(expense.date)
                        : "-"
                      : `Recurring${
                          expense.startDate
                            ? ` from ${fmt(expense.startDate)}`
                            : ""
                        }${
                          expense.endDate ? ` to ${fmt(expense.endDate)}` : ""
                        }`}
                  </p>
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <p className="text-gray-400 text-xs sm:text-sm">Category</p>
                  <p className="text-gray-200 text-sm truncate">
                    {expense.category?.category_name ??
                      `Category #${expense.categoryId}`}
                  </p>
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Description
                  </p>
                  <p className="text-gray-200 text-sm">
                    {expense.description?.length
                      ? expense.description
                      : "No description"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end p-4 sm:p-5 border-t border-gray-700 pt-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto border border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            Delete Expense
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default DeleteConfirmationModal;
