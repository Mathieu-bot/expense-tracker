import { Clock, Calendar } from "lucide-react";
import { formatDate, formatTime } from "../../../utils/formatters";
import { useEffect, useState } from "react";

const DateDropdown = () => {
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex items-center gap-2 justify-end text-gray-700 dark:text-white`}
      >
        <Clock size={18} className={"text-gray-700 dark:text-white"} />
        <span className="font-medium text-sm">{formatTime(date)}</span>
        <span
          className={`mx-1 text-gray-400"
          }`}
        >
          |
        </span>
        <Calendar size={18} className={"text-gray-700 dark:text-white"} />
        <span className="font-medium text-sm">{formatDate(date)}</span>
      </div>
    </div>
  );
};

export default DateDropdown;
