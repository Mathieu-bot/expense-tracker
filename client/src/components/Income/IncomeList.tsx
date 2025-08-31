import { forwardRef, useImperativeHandle } from "react";
import type { Income } from "../../types/Income";
import { useIncomes } from "../../hooks/useIncomes";
import { Button } from "../../ui";

interface IncomeListProps {
  startDate?: string;
  endDate?: string;
  onEdit: (income: Income) => void;
  onDelete: (income: Income) => void;
}

export interface IncomeListRef {
  refetch: () => void;
}

export const IncomeList = forwardRef<IncomeListRef, IncomeListProps>(
  ({ startDate, endDate, onEdit, onDelete }, ref) => {
    const { incomes, loading, error, refetch } = useIncomes(startDate, endDate);

    useImperativeHandle(ref, () => ({
      refetch,
    }));

    if (error) {
      return (
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">Error: {error}</div>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      );
    }

    return (
      <div className="income-list">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Incomes</h2>
          <Button onClick={refetch} size="small">
            Refresh
          </Button>
        </div>
        {loading && (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="size-10 mx-auto animate-spin rounded-full border-4 border-primary-light border-t-transparent"
              role="status"
              aria-label="Loading"
            ></div>
          </div>
        )}
        {incomes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No incomes found for the selected period
          </div>
        ) : (
          <div className="space-y-3">
            {incomes.map((income) => (
              <div
                key={income.income_id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-lg">
                        {income.amount.toFixed(2)} MGA
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-1">{income.source}</p>
                    {income.description && (
                      <p className="text-gray-500 text-sm mb-2">
                        {income.description}
                      </p>
                    )}
                    <p className="text-sm text-gray-400">
                      {new Date(income.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="small"
                      onClick={() => onEdit(income)}
                      className="border border-gray-300"
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      onClick={() => onDelete(income)}
                      className="bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
