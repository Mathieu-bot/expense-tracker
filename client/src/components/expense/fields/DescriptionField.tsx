import { TextField } from "../../../ui";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function DescriptionField({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm mb-1">Description</label>
      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Optional"
        classes={{
          input:
            "bg-white/5 backdrop-blur rounded-lg border border-white/10 focus:!ring-white/50 text-white dark:text-light/80 text-sm w-full",
          label: "hidden",
        }}
      />
    </div>
  );
}
