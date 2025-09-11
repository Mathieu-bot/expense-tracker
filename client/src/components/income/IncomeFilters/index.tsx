import { useState } from "react";
import { Calendar, Wallet } from "lucide-react";
import { Button, TextField } from "../../../ui";
import { SortFilter } from "./SortFilter";
import { DateRangeFilter } from "./DateRangeFilter";

interface IncomeFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOrder: "recent" | "oldest";
  onSortChange: (order: "recent" | "oldest") => void;
  dateRange: { start: Date | null; end: Date | null };
  dateError: string | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onClearDateFilter: () => void;
}

export const IncomeFilters = ({
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange,
  dateRange,
  dateError,
  onStartDateChange,
  onEndDateChange,
  onClearDateFilter,
}: IncomeFiltersProps) => {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold  dark:text-light/90  text-gray-800 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-accent" />
          All Incomes
        </h2>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-initial">
            <TextField
              label="Search incomes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              classes={{
                input:
                  "bg-white/5 backdrop-blur-md border border-gray-900/50 dark:border-white/10 text-white rounded-xl shadow",
                label:
                  "rounded-lg peer-placeholder-shown:text-gray-800/60 dark:peer-placeholder-shown:text-white/60",
              }}
            />
          </div>

          <SortFilter sortOrder={sortOrder} onSortChange={onSortChange} />

          <Button
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            className="bg-white/80 dark:bg-transparent dark:hover:bg-white/5 hover:bg-gray-100 border border-gray-300 dark:border-white/10 text-gray-800 dark:text-light/90 transition-all duration-300 hover:shadow-lg shadow-sm"
            startIcon={<Calendar className="w-4 h-4" />}
          >
            Filter
          </Button>
        </div>
      </div>

      {showAdvancedSearch && (
        <DateRangeFilter
          dateRange={dateRange}
          dateError={dateError}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          onClear={onClearDateFilter}
        />
      )}
    </>
  );
};
