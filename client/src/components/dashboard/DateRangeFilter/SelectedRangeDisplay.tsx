import { format } from "date-fns";

interface SelectedRangeDisplayProps {
  startDate: Date | null;
  endDate: Date | null;
}

const SelectedRangeDisplay = ({
  startDate,
  endDate,
}: SelectedRangeDisplayProps) => {
  const selectedRangeText =
    startDate && endDate
      ? `${format(startDate, "MMM dd, yyyy")} - ${format(
          endDate,
          "MMM dd, yyyy"
        )}`
      : "Select a date range";

  return (
    <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
        Selected Range:
      </p>
      <p className="text-primary-light dark:text-accent font-medium">
        {selectedRangeText}
      </p>
    </div>
  );
};

export default SelectedRangeDisplay;
