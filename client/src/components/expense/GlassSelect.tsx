import { Select } from "../../ui";

const GlassSelect = (props: React.ComponentProps<typeof Select>) => {
  return (
    <Select
      {...props}
      classes={{
        root: "flex",
        trigger:
          "!w-full bg-white/20 dark:bg-white/5 !text-white rounded-xl px-3 !ring-0 border-white/5 h-full",
        list: "!bg-white/5 backdrop-blur-2xl !border-none",
        icon: "text-white/50",
        option:
          "!w-full text-white hover:!bg-white/5 aria-selected:!bg-accent/10",
        error: "",
        helperText: "",
      }}
    />
  );
};

export default GlassSelect;
