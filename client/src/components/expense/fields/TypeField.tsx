import { Select } from "../../../ui";
import type { ExpenseType } from "../../../types/Expense";

type Props = {
  value: ExpenseType;
  onChange: (v: ExpenseType) => void;
};

export default function TypeField({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm mb-1">Type</label>
      <Select
        value={value || null}
        onChange={(v) => onChange(v as ExpenseType)}
        options={[
          { label: "One-time", value: "one-time" },
          { label: "Recurring", value: "recurring" },
        ]}
        placeholder="Select type"
        classes={{
          trigger:
            "!bg-transparent !border-none !outline-none !ring-0 focus:!ring-0 !shadow-none text-white dark:text-light/80 text-sm w-full",
          label: "hidden",
          list: "dark:bg-white/10 dark:backdrop-blur-xl rounded-2xl p-2 border border-white/10 shadow-lg",
          option: "dark:text-light/80 hover:bg-white/10",
        }}
      />
    </div>
  );
}
