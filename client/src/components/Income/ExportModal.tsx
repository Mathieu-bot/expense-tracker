import { useState } from "react";
import { X, Calendar } from "lucide-react";
import { Button } from "../../ui";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (startDate?: string, endDate?: string) => void;
}

export const ExportModal = ({ open, onClose, onExport }: ExportModalProps) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate && new Date(startDate) <= new Date(endDate)) {
      onExport(startDate, endDate);
    } else if (!startDate && !endDate) {
      onExport(); 
    }
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
  };

  const handleExportAll = () => {
    onExport(); 
    onClose();
  };

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
              />
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
            <Button
              type="button"
              onClick={handleExportAll}
              className="bg-accent hover:bg-accent/90 text-white"
            >
              Export All Receipts
            </Button>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleClear}
                className="flex-1"
              >
                Clear Dates
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={
                  !!(
                    startDate &&
                    endDate &&
                    new Date(startDate) > new Date(endDate)
                  )
                }
              >
                Export by Date Range
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
