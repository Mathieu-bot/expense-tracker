import { DatePicker } from "../../../ui";

function fmt(d: Date | null) {
  return d
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`
    : "";
}
const toDate = (s?: string) => (s ? new Date(s) : null);

type Props = {
  startDate?: string;
  endDate?: string;
  onChangeStart: (v?: string) => void;
  onChangeEnd: (v?: string) => void;
};

export default function RecurringDatesField({ startDate, endDate, onChangeStart, onChangeEnd }: Props) {
  return (
    <>
      <div>
        <label className="block text-sm mb-1">Start Date</label>
        <DatePicker
          value={toDate(startDate)}
          onChange={(d) => onChangeStart(fmt(d))}
          classes={{
            root: "w-full",
            input:
              "!bg-transparent !border-none !outline-none !ring-0 focus:!ring-0 !shadow-none text-white dark:text-light/50 !font-semibold text-sm w-full",
            label: "hidden",
            calendar:
              "dark:bg-white/10 dark:backdrop-blur-xl rounded-2xl p-3 border border-white/10 shadow-lg",
            nav: "flex justify-between items-center p-2 border-b border-gray-700",
            grid: "grid grid-cols-7 gap-1 p-2",
            day: "dark:text-light/80 hover:bg-white/10 rounded-lg transition-colors border-none",
            daySelected: "bg-blue-500 text-white",
            dayDisabled: "text-gray-500 cursor-not-allowed",
          }}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">End Date</label>
        <DatePicker
          value={toDate(endDate)}
          onChange={(d) => onChangeEnd(fmt(d))}
          classes={{
            root: "w-full",
            input:
              "!bg-transparent !border-none !outline-none !ring-0 focus:!ring-0 !shadow-none text-white dark:text-light/50 !font-semibold text-sm w-full",
            label: "hidden",
            calendar:
              "dark:bg-white/10 dark:backdrop-blur-xl rounded-2xl p-3 border border-white/10 shadow-lg",
            nav: "flex justify-between items-center p-2 border-b border-gray-700",
            grid: "grid grid-cols-7 gap-1 p-2",
            day: "dark:text-light/80 hover:bg-white/10 rounded-lg transition-colors border-none",
            daySelected: "bg-blue-500 text-white",
            dayDisabled: "text-gray-500 cursor-not-allowed",
          }}
        />
      </div>
    </>
  );
}
