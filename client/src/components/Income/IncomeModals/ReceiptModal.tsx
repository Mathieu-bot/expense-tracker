import React from "react";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import type { Income } from "../../../types/Income";

interface ReceiptModalProps {
  open: boolean;
  income: Income | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  open,
  income,
  onClose,
}) => {

  if (!open || !income) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className="bg-white/95 dark:bg-primary-light/20 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
        >
          x
        </button>

        <div className="text-center mb-6">
          <div className="flex w-full items-center justify-center mb-6">
            <img src="./Monogram.png" alt="Logo" className="w-12 h-12" />
          </div>
          <h2 className="dark:text-accent text-primary-light font-bold text-lg">INCOME RECEIPT</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {formatDate(income.date)}
          </p>
        </div>

        <div className="text-center mb-6 py-4 border-y border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Amount Received
          </p>
          <p className="dark:text-accent text-primary-light font-bold text-3xl">
            {formatCurrency(income.amount)}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">From</p>
            <p className="text-gray-800 dark:text-gray-200 font-medium">
              {income.source || "Unknown Source"}
            </p>
          </div>

          {income.description && (
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Description
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                {income.description}
              </p>
            </div>
          )}

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Transaction ID
            </p>
            <p className="text-gray-800 dark:text-gray-200 font-mono">
              #{income.income_id}
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Recorded on
            </p>
            <p className="text-gray-700 dark:text-gray-200">
              {formatDate(income.creation_date)}
            </p>
          </div>
        </div>

        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            Thank you for trusting us
          </p>
        </div>
      </div>
    </div>
  );
};
