import {
  isSameMonth,
  isSameDay,
  isAfter,
  isBefore,
  isToday,
  format,
} from "date-fns";
interface DayProps {
  day: Date;
  currentMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  onDateClick: (day: Date) => void;
}

const Day = ({
  day,
  currentMonth,
  startDate,
  endDate,
  onDateClick,
}: DayProps) => {
  const isCurrentMonth = isSameMonth(day, currentMonth);
  const isStart = startDate && isSameDay(day, startDate);
  const isEnd = endDate && isSameDay(day, endDate);
  const isInRange =
    startDate && endDate && isAfter(day, startDate) && isBefore(day, endDate);
  const isTodayDate = isToday(day);
  const isSelected = isStart || isEnd || isInRange;

  return (
    <div
      className={`h-10 w-10 flex items-center justify-center rounded-full text-sm transition-all duration-200 relative
        ${isCurrentMonth ? "text-foreground" : "text-muted-foreground/50"}
        ${isSelected ? "bg-accent/20" : ""}
        ${isStart ? "bg-accent text-white font-semibold rounded-r-none" : ""}
        ${isEnd ? "bg-accent text-white font-semibold rounded-l-none" : ""}
        ${isInRange ? "bg-accent/30 rounded-none" : ""}
        ${isTodayDate && !isSelected ? "border border-accent" : ""}
        ${isCurrentMonth && !isSelected ? "hover:bg-accent/10" : ""}
        cursor-pointer`}
      onClick={() => onDateClick(day)}
    >
      {format(day, "d")}
    </div>
  );
};

export default Day;
