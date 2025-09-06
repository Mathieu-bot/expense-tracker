import { useState, useEffect } from "react";
import { FileDown, Download } from "lucide-react";
import type { Income } from "../../../types/Income";
import { DatePicker } from "../../../ui";

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
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
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
        startDate ? startDate.toISOString().split("T")[0] : undefined,
        endDate ? endDate.toISOString().split("T")[0] : undefined
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
    setStartDate(null);
    setEndDate(null);
  };

  const isDateRangeValid = !(startDate && endDate && startDate > endDate);
  const hasIncomesToExport = filteredIncomes.length > 0;
  const isExportDisabled =
    !isDateRangeValid || !hasIncomesToExport || isExporting;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className="bg-white/95 dark:bg-primary-light/20 border border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl w-full max-w-lg z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center relative justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-5 mt-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
              <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-gray-800 dark:text-white font-bold text-xl">
                Income Receipts
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose a date range, or leave empty to export all incomes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 top-5 right-5 absolute hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            disabled={isExporting}
          >
            x
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 text-gray-700 dark:text-gray-200"
        >
          <div className="space-y-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                Filter by Date Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <DatePicker
                    label="Start Date"
                    classes={{
                      calendar:
                        "dark:bg-white/10 dark:backdrop-blur-xl rounded-2xl p-3 border border-white/10 shadow-lg",
                      day: "dark:text-light/80 hover:bg-white/10 rounded-lg transition-colors",
                      daySelected: "bg-accent dark:text-light font-medium",
                      dayDisabled: "dark:text-light/30 cursor-not-allowed",
                      nav: "flex justify-between items-center mb-2 dark:text-light/90",
                      grid: "grid grid-cols-7 gap-1",
                      input:
                        "bg-white/5 backdrop-blur-md border border-white/10 text-primary-dark placeholder-primary-dark/80 rounded-xl",
                      label: "rounded-full text-primary-dark",
                    }}
                    value={startDate}
                    onChange={setStartDate}
                    className="w-full"
                  />
                </div>
                <div>
                  <DatePicker
                    label="End Date"
                    classes={{
                      calendar:
                        "dark:bg-white/10 dark:backdrop-blur-xl rounded-2xl p-3 border border-white/10 shadow-lg",
                      day: "dark:text-light/80 hover:bg-white/10 rounded-lg transition-colors",
                      daySelected: "bg-accent dark:text-light font-medium",
                      dayDisabled: "dark:text-light/30 cursor-not-allowed",
                      nav: "flex justify-between items-center mb-2 dark:text-light/90",
                      grid: "grid grid-cols-7 gap-1",
                      input:
                        "bg-white/5 backdrop-blur-md border border-white/10 text-primary-dark placeholder-primary-dark/80 rounded-xl",
                      label: "rounded-full text-primary-dark",
                    }}
                    value={endDate}
                    onChange={setEndDate}
                    minDate={startDate || undefined}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-100/60 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Receipts found:
                </span>
                <span
                  className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    hasIncomesToExport
                      ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400"
                  }`}
                >
                  {filteredIncomes.length}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {hasIncomesToExport
                  ? "Ready to export"
                  : "No filter applied or no receipt found in selected range"}
              </p>
            </div>

            {startDate && endDate && startDate > endDate && (
              <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-200 dark:border-red-500/20">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  End date must be after start date
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleClear}
              className="border border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
              disabled={isExporting || (!startDate && !endDate)}
            >
              Clear
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-none px-4 py-2 rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isExportDisabled}
            >
              {isExporting ? (
                "Exporting..."
              ) : (
                <>
                  <FileDown className="w-4 h-4 mr-2" />
                  Export
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
