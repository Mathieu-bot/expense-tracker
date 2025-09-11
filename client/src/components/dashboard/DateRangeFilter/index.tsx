import { useState } from "react";
import { X, Calendar } from "lucide-react";
import { parseISO } from "date-fns";
import DateRangeModal from "./DateRangeModal";
import { formatDate } from "../../../utils/formatters";
import { motion } from "framer-motion";

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
        <motion.button
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={() => setIsModalOpen(true)}
          className={[
            "w-10 h-10 flex items-center justify-center",
            "rounded-full shadow-lg border-none p-0",
            "bg-gradient-to-r from-blue-600 to-indigo-600",
            "text-white hover:brightness-110 active:brightness-95",
            "transition-transform duration-150",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
            "dark:from-blue-500 dark:to-indigo-500 dark:focus:ring-offset-gray-900",
          ].join(" ")}
        >
          <Calendar className="w-4 h-4" />
        </motion.button>

        {!isDefaultRange() && startDate && endDate && (
          <div
            className={[
              "flex items-center gap-2",
              "px-3 py-1.5 rounded-lg shadow-lg",
              "bg-gradient-to-r from-blue-600 to-indigo-600",
              "text-white font-medium",
              "hover:brightness-110 active:brightness-95",
              "transition-colors duration-150",
              "border border-blue-800/40",
            ].join(" ")}
          >
            <span className="text-sm">{getDisplayText()}</span>
            <button
              onClick={handleCloseFilter}
              className="text-white hover:text-gray-200 transition-colors p-0 border-none"
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
