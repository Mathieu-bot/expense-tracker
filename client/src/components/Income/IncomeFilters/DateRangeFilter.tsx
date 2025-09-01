import { useState, useEffect } from "react";
import { Calendar, X } from "lucide-react";
import { Button } from "../../../ui";
import { GlassDatePicker } from "../GlassDatePicker";

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
    <div className="bg-gradient-to-br from-primary-light/10 to-primary-dark/10 backdrop-blur-xl rounded-2xl p-6 border border-white/5 mb-6 shadow-lg animate-in fade-in-50">
      <h3 className="text-lg font-medium text-light/90 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-accent" />
        Filter Incomes
      </h3>

      {showError && dateError && (
        <div className="mb-4 bg-rose-400/20 border border-rose-400/30 text-rose-400 px-4 py-3 rounded-xl backdrop-blur-sm flex items-center justify-between animate-in slide-in-from-top-5 duration-300">
          <span className="flex-1">{dateError}</span>
          <button
            onClick={() => setShowError(false)}
            className="ml-3 p-1 hover:bg-rose-400/30 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onClear}
          className="border border-white/30 text-light/80 bg-transparent hover:bg-white/10"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
