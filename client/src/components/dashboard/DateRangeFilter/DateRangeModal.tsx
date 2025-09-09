import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { addMonths, subMonths, isBefore, parseISO } from "date-fns";
import CalendarHeader from "./CalendarHeader";
import DaysOfWeek from "./DaysOfWeek";
import CalendarGrid from "./CalendarGrid";
import SelectedRangeDisplay from "./SelectedRangeDisplay";
import { Button } from "../../../ui";
import { formatDateISO } from "../../../utils/formatters";

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (startDate: string, endDate: string) => void;
  onReset?: () => void;
  initialStartDate?: string;
  initialEndDate?: string;
  defaultStartDate?: string;
  defaultEndDate?: string;
}

const DateRangeModal = ({
  isOpen,
  onClose,
  onReset,
  onConfirm,
  defaultEndDate,
  defaultStartDate,
  initialStartDate,
  initialEndDate,
}: DateRangeModalProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date | null>(
    initialStartDate ? parseISO(initialStartDate) : new Date()
  );
  const [endDate, setEndDate] = useState<Date | null>(
    initialEndDate ? parseISO(initialEndDate) : new Date()
  );

  useEffect(() => {
    if (initialStartDate) setStartDate(parseISO(initialStartDate));
    if (initialEndDate) setEndDate(parseISO(initialEndDate));
  }, [initialStartDate, initialEndDate]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleDateClick = (day: Date) => {
    if (!startDate) {
      setStartDate(day);
    } else if (!endDate) {
      if (isBefore(day, startDate)) {
        setEndDate(startDate);
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    } else {
      setStartDate(day);
      setEndDate(null);
    }
  };

  const handleConfirm = () => {
    const finalStartDate = startDate || new Date();
    const finalEndDate = endDate || new Date();

    const formattedStart = formatDateISO(finalStartDate); 
    const formattedEnd = formatDateISO(finalEndDate); 

    if (
      formattedStart === defaultStartDate &&
      formattedEnd === defaultEndDate
    ) {
      if (onReset) onReset(); 
    } else {
      onConfirm(formattedStart, formattedEnd);
    }

    onClose();
  };

  const handleReset = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setStartDate(firstDay);
    setEndDate(lastDay);

    if (onReset) onReset();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white/95 dark:bg-primary-light/20 rounded-2xl p-10 border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-3 right-3">
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <CalendarHeader
          currentMonth={currentMonth}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
        />

        <DaysOfWeek currentMonth={currentMonth} />

        <CalendarGrid
          currentMonth={currentMonth}
          startDate={startDate}
          endDate={endDate}
          onDateClick={handleDateClick}
        />

        <SelectedRangeDisplay startDate={startDate} endDate={endDate} />

        <div className="flex justify-between mt-6 gap-3">
          <Button
            onClick={handleReset}
            size="medium"
            fullWidth
            startIcon={<X className="w-4 h-4" />}
            className="bg-gray-200/80 hover:bg-gray-200/50 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
          >
            Reset
          </Button>
          <Button
            onClick={handleConfirm}
            size="medium"
            fullWidth
            startIcon={<Check className="w-4 h-4" />}
            className="bg-accent/80 hover:bg-accent/50 text-white"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateRangeModal;
