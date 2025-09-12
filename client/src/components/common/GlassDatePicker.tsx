import { DatePicker } from "../../ui";

export const GlassDatePicker = (
  props: React.ComponentProps<typeof DatePicker>
) => {
  return (
    <DatePicker
      {...props}
      classes={{
        calendar:
          "dark:bg-white/10 dark:backdrop-blur-xl rounded-2xl p-3 border border-white/10 shadow-lg bg-white/80 backdrop-blur-xl",
        day: "dark:text-light/80 hover:bg-white/10 hover:!border-accent/50 !ring-0 rounded-lg transition-colors",
        daySelected:
          "!bg-accent dark:!bg-accent/10 dark:text-light font-medium",
        dayDisabled: "dark:text-light/30 cursor-not-allowed",
        nav: "",
        grid: "grid grid-cols-7 gap-1",
        input:
          "bg-white/20 dark:bg-white/5 !border-white/5 text-gray-800 dark:text-white placeholder: dark:placeholder-light/60 rounded-xl focus:!ring-0 focus:!border-accent dark:focus:!border-white/20 !ring-0",
        label:
          "rounded-full dark:peer-placeholder-shown:text-white",
      }}
    />
  );
};
