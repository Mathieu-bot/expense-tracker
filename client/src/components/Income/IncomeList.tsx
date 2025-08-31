import {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useMemo,
} from "react";
import type { Income } from "../../types/Income";
import { Button } from "../../ui";
import { Eye, Edit3, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";

interface IncomeListProps {
  incomes: Income[];
  loading: boolean;
  error: string | null;
  searchQuery?: string;
  sortOrder?: "recent" | "oldest";
  onEdit: (income: Income) => void;
  onDelete: (income: Income) => void;
  onViewReceipt: (income: Income) => void;
  onRefetch: () => void;
}

export interface IncomeListRef {
  refetch: () => void;
}

export const IncomeList = forwardRef<IncomeListRef, IncomeListProps>(
  (
    { incomes, loading, error, onEdit, onDelete, onViewReceipt, onRefetch },
    ref
  ) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    useImperativeHandle(ref, () => ({
      refetch: onRefetch,
    }));

    const displayedItems = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return incomes.slice(startIndex, endIndex);
    }, [incomes, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(incomes.length / itemsPerPage);

    useEffect(() => {
      if (
        currentPage > 1 &&
        (currentPage - 1) * itemsPerPage >= incomes.length
      ) {
        setCurrentPage(1);
      }
    }, [incomes.length, currentPage, itemsPerPage]);
    if (loading) {
      return (
        <div className="w-full h-96 flex items-center justify-center">
          <div
            className="size-10 mx-auto animate-spin rounded-full border-4 border-accent border-t-transparent"
            role="status"
            aria-label="Loading"
          ></div>
        </div>
      );
    }

    return (
      <div className="relative z-10">
        <div className="flex justify-end items-center mb-6">
          <Button
            onClick={onRefetch}
            size="small"
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-light/90"
          >
            Refresh
          </Button>
        </div>

        {error ||
        !incomes ||
        incomes.length === 0 ||
        displayedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-light/50">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Eye className="w-8 h-8" />
            </div>
            <p className="text-lg mb-2">No incomes found</p>
            <p className="text-sm">Try adjusting your search"</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 mb-4">
              {displayedItems.map((income) => (
                <div
                  key={income.income_id}
                  className="bg-white/8 backdrop-blur-lg rounded-xl p-4 border border-white/15 hover:border-accent/30 transition-all duration-300 cursor-pointer hover:shadow-lg group"
                  onClick={() => onViewReceipt(income)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-8">
                        <span className="text-accent font-bold text-sm bg-accent/10 px-3 py-1.5 rounded-md min-w-[80px] text-center">
                          {formatCurrency(income.amount)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-light/95 text-sm truncate">
                            {income.source}
                          </h3>
                          <p className="text-light/60 text-xs mt-0.5">
                            {formatDate(income.date)}
                          </p>
                          {income.description && (
                            <p className="text-light/70 text-xs mt-1.5 truncate">
                              {income.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(income);
                          }}
                          className="bg-white/10 hover:bg-white/20 border border-white/15 text-light/90 p-1.5 rounded-md transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(income);
                          }}
                          className="bg-red-400/15 hover:bg-red-400/25 border border-red-400/20 text-red-400 p-1.5 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-light/90"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-light/60">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-light/90"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);
