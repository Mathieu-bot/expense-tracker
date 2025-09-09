import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
} from "date-fns";
import Day from "./Day";

interface CalendarGridProps {
  currentMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  onDateClick: (day: Date) => void;
}

const CalendarGrid = ({
  currentMonth,
  startDate,
  endDate,
  onDateClick,
}: CalendarGridProps) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDateCalendar = startOfWeek(monthStart);
  const endDateCalendar = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDateCalendar;

  while (day <= endDateCalendar) {
    for (let i = 0; i < 7; i++) {
      days.push(
        <Day
          key={day.toString()}
          day={day}
          currentMonth={currentMonth}
          startDate={startDate}
          endDate={endDate}
          onDateClick={onDateClick}
        />
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-1">
        {days}
      </div>
    );
    days = [];
  }

  return <div className="grid gap-1">{rows}</div>;
};

export default CalendarGrid;
