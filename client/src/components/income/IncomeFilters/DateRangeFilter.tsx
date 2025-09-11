import { useState, useEffect } from "react";
import { Calendar, X } from "lucide-react";
import { Button } from "../../../ui";
import { GlassDatePicker } from "../../common/GlassDatePicker";
import { motion, AnimatePresence } from "framer-motion";

interface DateRangeFilterProps {
  dateRange: { start: Date | null; end: Date | null };
  dateError: string | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onClear: () => void;
}

export const DateRangeFilter = ({
  dateRange,
  dateError,
  onStartDateChange,
  onEndDateChange,
  onClear,
}: DateRangeFilterProps) => {
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    setShowError(!!dateError);
  }, [dateError]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="dark:bg-transparent bg-white/25 dark:bg-gradient-to-br dark:from-primary-light/10 dark:to-primary-dark/10 backdrop-blur-xl rounded-2xl p-6 border border-white/5 mb-6 shadow-lg"
    >
      <motion.h3
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-lg font-medium text-white dark:text-light/90 mb-4 flex items-center gap-2"
      >
        <Calendar className="w-5 h-5 text-accent" />
        Filter Incomes
      </motion.h3>

      <AnimatePresence>
        {showError && dateError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mb-4 bg-gradient-to-r from-red-100 to-pink-100 dark:bg-rose-400/20 border border-red-200 dark:border-rose-400/30 text-red-700 dark:text-rose-400 px-4 py-3 rounded-xl backdrop-blur-sm flex items-center justify-between"
          >
            <span className="flex-1">{dateError}</span>
            <button
              onClick={() => setShowError(false)}
              className="ml-3 p-1 hover:bg-red-200/50 dark:hover:bg-rose-400/30 rounded transition-colors"
            >
              <X className="w-4 h-4 text-red-600 dark:text-rose-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
      >
        <GlassDatePicker
          value={dateRange.start}
          onChange={onStartDateChange}
          label="Start Date"
          size="medium"
        />
        <GlassDatePicker
          value={dateRange.end}
          onChange={onEndDateChange}
          label="End Date"
          size="medium"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex gap-3"
      >
        <Button
          onClick={onClear}
          className="bg-gradient-to-br from-accent/25 to-accent/20 bg-white/80
          text-amber-800/90
          dark:bg-white/5 dark:hover:bg-white/10 dark:text-light/90
          border border-accent/30 dark:border-white/10
          hover:shadow-md transition-all"
        >
          Clear
        </Button>
      </motion.div>
    </motion.div>
  );
};
