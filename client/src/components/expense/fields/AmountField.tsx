import { TextField } from "../../../ui";

type Props = {
  value: string | number;
  onChange: (v: string) => void;
};

export default function AmountField({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm mb-1">Amount</label>
      <TextField
        type="number"
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.00"
        classes={{
          input:
            "bg-white/5 backdrop-blur rounded-lg border border-white/10 focus:!ring-white/50 text-white dark:text-light/80 !font-semibold text-sm w-full",
          label: "hidden",
        }}
      />
    </div>
  );
}
