import { Clock, Calendar } from "lucide-react";
import { formatDate, formatTime } from "../../../../utils/formatters";

const DateDropdown = ({
  shouldShowGlassmorphism,
}: {
  shouldShowGlassmorphism: boolean;
}) => {
  const currentDate = new Date();

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex items-center gap-2 justify-end ${
          shouldShowGlassmorphism
            ? "text-gray-700 dark:text-white"
            : "text-white"
        }`}
      >
        <Clock
          size={18}
          className={
            shouldShowGlassmorphism
              ? "text-gray-700 dark:text-white"
              : "text-white"
          }
        />
        <span className="font-medium text-sm">{formatTime(currentDate)}</span>
        <span
          className={`mx-1 ${
            shouldShowGlassmorphism ? "text-gray-400" : "text-white/50"
          }`}
        >
          |
        </span>
        <Calendar
          size={18}
          className={
            shouldShowGlassmorphism
              ? "text-gray-700 dark:text-white"
              : "text-white"
          }
        />
        <span className="font-medium text-sm">{formatDate(currentDate)}</span>
      </div>

      {/* <div className="flex items-center gap-1">
        <button
          onClick={() => changeDate(-1)}
          className="p-1 focus:outline-none border-none"
        >
          <ChevronLeft
            size={16}
            className={
              shouldShowGlassmorphism
                ? "text-gray-500 hover:text-gray-700 dark:text-white/70 dark:hover:text-white"
                : "text-white/70 hover:text-white"
            }
          />
        </button>

        <button
          onClick={() => setCurrentDate(new Date())}
          className={`text-xs px-2 py-1 border-none rounded-lg transition-colors duration-200 focus:outline-none ${
            shouldShowGlassmorphism
              ? "bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-400/20 dark:hover:bg-gray-400/30 dark:text-white"
              : "bg-white/20 hover:bg-white/30 text-white"
          }`}
        >
          Today
        </button>

        <button
          onClick={() => changeDate(1)}
          className="p-1 focus:outline-none border-none"
        >
          <ChevronRight
            size={16}
            className={
              shouldShowGlassmorphism
                ? "text-gray-500 hover:text-gray-700 dark:text-white/70 dark:hover:text-white"
                : "text-white/70 hover:text-white"
            }
          />
        </button>
      </div> */}
    </div>
  );
};

export default DateDropdown;
