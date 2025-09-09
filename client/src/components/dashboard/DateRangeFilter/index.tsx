import { useState } from "react";
import { X, Calendar } from "lucide-react";
import { parseISO } from "date-fns";
import DateRangeModal from "./DateRangeModal";
import { formatDate } from "../../../utils/formatters";

interface DateRangeFilterProps {
  startDate?: string;
  endDate?: string;
  onChange: (startDate: string, endDate: string) => void;
  onReset: () => void;
  className?: string;
}

const DateRangeFilter = ({
  startDate,
  endDate,
  onChange,
  onReset,
  className = "",
}: DateRangeFilterProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const now = new Date();
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const isDefaultRange = () => {
    if (!startDate || !endDate) return true;
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    return (
      start.getTime() === defaultStart.getTime() &&
      end.getTime() === defaultEnd.getTime()
    );
  };

  const handleConfirm = (newStartDate: string, newEndDate: string) => {
    onChange(newStartDate, newEndDate);
    setIsModalOpen(false);
  };

  const handleCloseFilter = () => {
    onReset();
  };

  const getDisplayText = () => {
    if (!startDate || !endDate) return "";

    const start = parseISO(startDate);
    const end = parseISO(endDate);

    if (start.getTime() === end.getTime()) {
      return formatDate(start);
    }

    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-0 w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors shadow-sm"
        >
          <Calendar className="w-4 h-4" />
        </button>

        {!isDefaultRange() && startDate && endDate && (
          <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800">
            <span className="text-sm font-medium">{getDisplayText()}</span>
            <button
              onClick={handleCloseFilter}
              className="text-blue-600 p-0 border-none dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <DateRangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        initialStartDate={startDate}
        initialEndDate={endDate}
        onReset={onReset}
        defaultStartDate={defaultStart.toISOString().slice(0, 10)}
        defaultEndDate={defaultEnd.toISOString().slice(0, 10)}
      />
    </div>
  );
};

export default DateRangeFilter;
