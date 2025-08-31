import { DatePicker } from "../../ui";

export const GlassDatePicker = (
  props: React.ComponentProps<typeof DatePicker>
) => {
  return (
    <DatePicker
      {...props}
      classes={{
        calendar:
          "bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/10 shadow-lg",
        day: "text-light/80 hover:bg-white/10 rounded-lg transition-colors",
        daySelected: "bg-accent text-light font-medium",
        dayDisabled: "text-light/30 cursor-not-allowed",
        nav: "flex justify-between items-center mb-2 text-light/90",
        grid: "grid grid-cols-7 gap-1",
        input:
          "bg-white/5 backdrop-blur-md border border-white/10 text-light placeholder-light/60 rounded-xl",
        label: "rounded-full text-primary-dark ", // force hide label completely
      }}
    />
  );
};
