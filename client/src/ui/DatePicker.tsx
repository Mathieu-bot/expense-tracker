import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  SIZE_PADDING_MAP,
  LABEL_BASE,
  INPUT_BASE,
  INPUT_RING_BASE,
  INPUT_FOCUS_BASE,
} from "./constants/inputs";
import {
  WEEKDAYS,
  clamp,
  isSameDay,
  startOfDay,
  getMonthDays,
} from "./constants/date";
import {
  CALENDAR_BASE,
  CALENDAR_ANIM_TOP,
  CALENDAR_ANIM_BOTTOM,
  NAV_BASE,
  GRID_BASE,
  HEADER_ROW,
  HEADER_CELL,
  DAY_BASE,
  DAY_SELECTED,
  DAY_DISABLED,
} from "./constants/datepicker";
import { useAnchoredPopover } from "./hooks/useAnchoredPopover";

export interface DatePickerClasses {
  root?: string;
  input?: string;
  calendar?: string;
  nav?: string;
  grid?: string;
  day?: string;
  daySelected?: string;
  dayDisabled?: string;
  label?: string;
}

export interface DatePickerProps {
  value: Date | null;
  onChange: (value: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  label?: string;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
  classes?: DatePickerClasses;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Select date",
  label,
  required = false,
  optional = false,
  disabled,
  size = "medium",
  className,
  classes,
}) => {
  const idRef = React.useId();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Date>(() => value ?? new Date());
  const triggerRef = useRef<HTMLInputElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const { coords, placement } = useAnchoredPopover(open, triggerRef, popRef, [
    view,
  ]);

  const days = useMemo(() => getMonthDays(view), [view]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (popRef.current?.contains(t) || triggerRef.current?.contains(t))
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const sizePadding = SIZE_PADDING_MAP[size];

  const inputCls = [
    INPUT_BASE,
    sizePadding,
    INPUT_RING_BASE,
    "placeholder-transparent",
    INPUT_FOCUS_BASE,
    disabled ? "opacity-60 cursor-not-allowed" : "",
    classes?.input,
  ]
    .filter(Boolean)
    .join(" ");

  const calCls = [
    CALENDAR_BASE,
    placement === "top" ? CALENDAR_ANIM_TOP : CALENDAR_ANIM_BOTTOM,
    classes?.calendar,
  ]
    .filter(Boolean)
    .join(" ");

  const navCls = [NAV_BASE, classes?.nav].filter(Boolean).join(" ");
  const gridCls = [GRID_BASE, classes?.grid].filter(Boolean).join(" ");
  const dayBase = [DAY_BASE, classes?.day].filter(Boolean).join(" ");
  const daySel = [DAY_SELECTED, classes?.daySelected].filter(Boolean).join(" ");
  const dayDis = [DAY_DISABLED, classes?.dayDisabled].filter(Boolean).join(" ");

  const fmt = (d: Date | null) =>
    d
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`
      : "";

  const toLocalDate = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const isDisabled = (d: Date) => {
    if (minDate && d < startOfDay(minDate)) return true;
    if (maxDate && d > startOfDay(maxDate)) return true;
    return false;
  };

  const calendar = (
    <div
      ref={popRef}
      className={calCls}
      role="dialog"
      aria-modal="true"
      style={{ left: coords.left, top: coords.top, width: coords.width }}
    >
      <div className={navCls}>
        <button
          type="button"
          className="px-2 py-1 rounded hover:bg-white/10"
          onClick={() =>
            setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))
          }
          aria-label="Previous month"
        >
          ‹
        </button>
        <div className="text-sm font-medium">
          {view.toLocaleString("en-US", { month: "long", year: "numeric" })}
        </div>
        <button
          type="button"
          className="px-2 py-1 rounded hover:bg-white/10"
          onClick={() =>
            setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))
          }
          aria-label="Next month"
        >
          ›
        </button>
      </div>
      <div className={HEADER_ROW}>
        {WEEKDAYS.map((d) => (
          <div key={d} className={HEADER_CELL}>
            {d}
          </div>
        ))}
      </div>
      <div className={gridCls}>
        {days.map((d, i) =>
          d ? (
            <button
              key={i}
              className={[
                dayBase,
                value && isSameDay(d, value) ? daySel : "",
                isDisabled(d) ? dayDis : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                if (isDisabled(d)) return;
                onChange(clamp(toLocalDate(d), minDate, maxDate));
                setOpen(false);
              }}
            >
              {d.getDate()}
            </button>
          ) : (
            <div key={i} className="h-8 w-8" />
          )
        )}
      </div>
    </div>
  );

  const renderLabel = label ?? placeholder ?? "Select date";
  const labelBase = LABEL_BASE;
  const hasValue = !!value;

  return (
    <div
      className={[classes?.root, "relative", className]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        id={idRef}
        ref={triggerRef}
        type="text"
        readOnly
        value={fmt(value)}
        placeholder={renderLabel}
        className={inputCls}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-required={required || undefined}
        required={required || undefined}
        onClick={() => !disabled && setOpen((v) => !v)}
      />
      {renderLabel && (
        <label
          htmlFor={idRef}
          className={[
            labelBase,
            "left-4",
            hasValue
              ? "bg-white"
              : "bg-transparent peer-focus:!bg-white peer-placeholder-shown:bg-transparent",
            classes?.label,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {renderLabel}
          {required && (
            <span aria-hidden="true" className="text-rose-600 ml-0.5">
              *
            </span>
          )}
          {!required && optional && (
            <span className="ml-1 text-[11px] font-normal text-gray-400">
              (optional)
            </span>
          )}
        </label>
      )}
      {open && createPortal(calendar, document.body)}
    </div>
  );
};

export default DatePicker;
