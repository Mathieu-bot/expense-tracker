import { Clock, Calendar } from "lucide-react";
import { useState } from "react";

const DateDropdown = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-white justify-end">
        <Clock size={18} className="text-white" />
        <span className="font-medium text-sm">{formatTime(currentDate)}</span>
        <span className="mx-1">|</span>
        <Calendar size={18} className="text-white" />
        <span className="font-medium text-sm">{formatDate(currentDate)}</span>
      </div>

      {/* <div className="flex items-center gap-1">
        <button
          onClick={() => changeDate(-1)}
          className="p-1 focus:outline-none border-none"
        >
          <ChevronLeft size={16} className="text-white/70 hover:text-white" />
        </button>

        <button
          onClick={() => setCurrentDate(new Date())}
          className="text-xs px-2 py-1 border-none rounded-lg bg-gray-400/20 hover:bg-gray-400/30 text-white transition-colors duration-200 focus:outline-none"
        >
          Today
        </button>

        <button
          onClick={() => changeDate(1)}
          className="p-1 focus:outline-none border-none"
        >
          <ChevronRight size={16} className="text-white/70 hover:text-white" />
        </button>
      </div> */}
    </div>
  );
};

export default DateDropdown;
