import { Select } from "../../../ui";
import { useCategories } from "../../../hooks/useCategories";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function CategoryField({ value, onChange }: Props) {
  const { categories, loading, error, refetch } = useCategories();
  return (
    <div>
      <label className="block text-sm mb-1">Category</label>
      <Select
        value={value || null}
        onChange={(v) => onChange(String(v))}
        options={categories.map((c) => ({ label: c.category_name, value: String(c.category_id) }))}
        placeholder={error ? "Retry to load categories" : "Select a category"}
        disabled={loading}
        classes={{
          trigger:
            "bg-white/5 backdrop-blur rounded-lg border border-white/10 focus:!ring-white/50 text-white dark:text-light/80 !font-semibold text-sm w-full",
          label: "hidden",
          list: "dark:bg-white/10 dark:backdrop-blur-xl rounded-2xl p-2 border border-white/10 shadow-lg",
          option: "dark:text-light/80 hover:bg-white/10",
        }}
      />
      {error && (
        <div className="mt-1 text-xs text-red-300">
          {error} <button type="button" className="underline" onClick={() => refetch()}>Retry</button>
        </div>
      )}
    </div>
  );
}
