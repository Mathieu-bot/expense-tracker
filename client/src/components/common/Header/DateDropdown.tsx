import { Clock, Calendar } from "lucide-react";
import { formatDate, formatTime } from "../../../utils/formatters";

const DateDropdown = () => {
  const currentDate = new Date();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 justify-end text-gray-700 dark:text-white">
        <Clock size={18} className="text-gray-700 dark:text-white" />
        <span className="font-medium text-sm">{formatTime(currentDate)}</span>
        <span className="mx-1 text-gray-400">|</span>
        <Calendar size={18} className="text-gray-700 dark:text-white" />
        <span className="font-medium text-sm">{formatDate(currentDate)}</span>
      </div>
    </div>
  );
};

export default DateDropdown;
