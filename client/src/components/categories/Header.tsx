import { Button } from "../../ui";
import type { HeaderProps } from "../../types/Category";

export const CategoriesHeader = ({ bulkMode, onToggleBulkMode }: HeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
      <div className="flex flex-col gap-2 w-full md:w-auto">
        <h1 className="text-4xl font-bold">Categories</h1>
        <p className="text-light/60">Manage your categories</p>
      </div>
      <div className="flex items-center gap-2 self-start md:self-auto w-full md:w-auto">
        <Button
          onClick={onToggleBulkMode}
          size="small"
          className={"!h-auto !py-1.5 " + (bulkMode ? "bg-accent/20 border border-accent/40" : "bg-black/20 hover:bg-black/15 dark:bg-white/10 dark:hover:bg-white/15 border border-white/20")}
        >
          {bulkMode ? "Bulk: ON" : "Bulk select"}
        </Button>
      </div>
    </div>
  );
};

export default CategoriesHeader;
