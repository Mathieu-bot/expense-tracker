import { useState, useEffect } from "react";
import { X, Calendar, FileDown } from "lucide-react";
import { Button } from "../../ui";
import type { Income } from "../../types/Income";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (startDate?: string, endDate?: string) => Promise<boolean>;
  incomes: Income[];
}

export const ExportModal = ({
  open,
  onClose,
  onExport,
  incomes,
}: ExportModalProps) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredIncomes, setFilteredIncomes] = useState<Income[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let filtered = incomes;

    if (startDate || endDate) {
      filtered = incomes.filter((income) => {
        const incomeDate = new Date(income.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && end) {
          return incomeDate >= start && incomeDate <= end;
        } else if (start) {
          return incomeDate >= start;
        } else if (end) {
          return incomeDate <= end;
        }
        return true;
      });
    }

    setFilteredIncomes(filtered);
  }, [startDate, endDate, incomes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (filteredIncomes.length === 0) return;

    setIsExporting(true);

    try {
      const success = await onExport(
        startDate || undefined,
        endDate || undefined
      );

      if (success) {
        onClose();
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
  };

  const isDateRangeValid = !(
    startDate &&
    endDate &&
    new Date(startDate) > new Date(endDate)
  );
  const hasIncomesToExport = filteredIncomes.length > 0;
  const isExportDisabled =
    !isDateRangeValid || !hasIncomesToExport || isExporting;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-primary-dark rounded-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-light/90 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            Export Receipts
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            disabled={isExporting}
          >
            <X className="w-5 h-5 text-gray-600 dark:text-light/70" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-light/80 mb-2">
                Start Date (optional)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-primary-dark/50 text-gray-800 dark:text-light"
                disabled={isExporting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-light/80 mb-2">
                End Date (optional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-primary-dark/50 text-gray-800 dark:text-light"
                disabled={isExporting}
              />
            </div>

            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-light/80">
                  Incomes found:
                </span>
                <span
                  className={`text-sm font-semibold ${
                    hasIncomesToExport
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {filteredIncomes.length}
                </span>
              </div>
              {!hasIncomesToExport && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                  No incomes found in the selected date range
                </p>
              )}
            </div>

            {startDate &&
              endDate &&
              new Date(startDate) > new Date(endDate) && (
                <p className="text-red-500 text-sm">
                  End date must be after start date
                </p>
              )}
          </div>

          <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-white/10">
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleClear}
                className="flex-1"
                disabled={isExporting || (!startDate && !endDate)}
              >
                Clear Dates
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={isExportDisabled}
                loading={isExporting}
              >
                <FileDown className="w-4 h-4 mr-2" />
                {isExporting ? "Exporting..." : "Export"}
              </Button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-sm text-gray-600 dark:text-light/70 hover:text-gray-800 dark:hover:text-light/90 underline"
                disabled={isExporting}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
