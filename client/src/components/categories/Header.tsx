import { Button } from "../../ui";
import type { HeaderProps } from "../../types/Category";

export const CategoriesHeader = ({
  bulkMode,
  onToggleBulkMode,
}: HeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
      <div className="flex flex-col gap-2 w-full md:w-auto">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-light/90">
          Categories
        </h1>
        <p className="text-gray-600 dark:text-light/60">
          Manage your categories
        </p>
      </div>
      <div className="flex items-center gap-2 self-start md:self-auto w-full md:w-auto">
        <Button
          onClick={onToggleBulkMode}
          size="small"
          className={
            "!h-auto !py-1.5 border transition-all duration-200 " +
            (bulkMode
              ? "bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200 shadow-md dark:bg-accent/20 dark:border-accent/40 dark:text-white"
              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md dark:bg-white/10 dark:hover:bg-white/15 dark:border-white/20 dark:text-white")
          }
        >
          {bulkMode ? "Bulk: ON" : "Bulk select"}
        </Button>
      </div>
    </div>
  );
};

export default CategoriesHeader;
