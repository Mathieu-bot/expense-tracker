import { startOfWeek, addDays, format } from "date-fns";

interface DaysOfWeekProps {
  currentMonth: Date;
}

const DaysOfWeek = ({ currentMonth }: DaysOfWeekProps) => {
  const days: React.ReactNode[] = [];
  const startDate = startOfWeek(currentMonth);

  for (let i = 0; i < 7; i++) {
    days.push(
      <div
        key={i}
        className="h-10 flex items-center justify-center text-sm text-muted-foreground font-medium"
      >
        {format(addDays(startDate, i), "EEE").charAt(0)}
      </div>
    );
  }

  return <div className="grid grid-cols-7 gap-1 mb-2">{days}</div>;
};

export default DaysOfWeek;
