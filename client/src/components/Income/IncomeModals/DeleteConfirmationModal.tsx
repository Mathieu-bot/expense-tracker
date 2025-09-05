import React, { useEffect } from "react";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import type { Income } from "../../../types/Income";
import { X } from "lucide-react";

interface DeleteConfirmationModalProps {
  open: boolean;
  income: Income | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmationModal: React.FC<
  DeleteConfirmationModalProps
> = ({ open, income, onClose, onConfirm }) => {
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

  return (
    <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className="bg-primary-light/20 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h3 className="text-red-600 font-bold text-xl">Confirm Delete</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 text-gray-200">
          <p className="mb-4">
            Are you sure you want to delete this income? This action cannot be
            undone.
          </p>

          {income && (
            <div className="mt-4 p-4 bg-gray-800/40 border border-gray-700 rounded-lg">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-400 text-sm">Amount</p>
                  <p className="text-red-600 font-medium">
                    {formatCurrency(income.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Date</p>
                  <p className="text-gray-200">{formatDate(income.date)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400 text-sm">Source</p>
                  <p className="text-gray-200">
                    {income.source.length > 0
                      ? income.source
                      : "No source specified"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end p-5 border-t border-gray-700 pt-4">
          <button
            onClick={onClose}
            className="border border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            Delete Income
          </button>
        </div>
      </div>
    </div>
  );
};
