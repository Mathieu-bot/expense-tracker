import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const CalendarHeader = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
}: CalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onPrevMonth}
        className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>
      <h2 className="text-xl font-semibold text-foreground">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <button
        onClick={onNextMonth}
        className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>
    </div>
  );
};

export default CalendarHeader;
