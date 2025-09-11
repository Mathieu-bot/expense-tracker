import { Button, Select } from "../../ui";
import { LayoutGrid, List as ListIcon, Filter } from "lucide-react";
import type { HeaderProps, SortOrder } from "../../types/Category";

export const CategoriesHeader = ({
  viewMode,
  onToggleView,
  sortOrder,
  onSortChange,
  bulkMode,
  onToggleBulkMode,
  selectedCount = 0,
  onBulkDelete,
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
          onClick={onToggleView}
          size="small"
          className="!h-auto !py-1.5 bg-white hover:bg-gray-50 !border !border-gray-200 text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 dark:bg-white/10 dark:hover:bg-white/15 dark:!border-white/50 dark:text-white"
          startIcon={
            viewMode === "list" ? (
              <LayoutGrid className="w-4 h-4" />
            ) : (
              <ListIcon className="w-4 h-4" />
            )
          }
        >
          {viewMode === "list" ? "Grid" : "List"}
        </Button>

        <div className="relative w-[150px]">
          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/80">
            <Filter className="w-4 h-4" />
          </span>
          <Select<SortOrder>
            value={sortOrder}
            onChange={(v) => onSortChange(v as SortOrder)}
            options={[
              { label: "Name A→Z", value: "name_asc" },
              { label: "Name Z→A", value: "name_desc" },
              { label: "Recently updated", value: "date_desc" },
              { label: "Oldest", value: "date_asc" },
            ]}
            placeholder="Sort by"
            classes={{
              trigger:
                "!bg-white !text-gray-800 !border-gray-200 pl-8 placeholder-gray-500 !px-2 !py-1.5 !text-sm !pl-8 focus:!ring-2 focus:!ring-blue-500/20 focus:!border-blue-500 dark:!bg-white/10 dark:!text-white dark:!border-white/10 dark:placeholder-white/60 dark:focus:!ring-primary-light",
              icon: "hidden",
              list: "!bg-white !border-gray-200 !shadow-lg !ring-0 p-1 dark:!bg-neutral-900/95 dark:!backdrop-blur-md dark:!border-white/10",
              option:
                "!text-gray-800 hover:!bg-blue-50 aria-selected:!bg-blue-100 aria-selected:!text-blue-800 dark:!text-white dark:hover:!bg-white/10 dark:aria-selected:!bg-white/10",
            }}
          />
        </div>

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

        <Button
          onClick={onBulkDelete}
          size="small"
          disabled={!selectedCount}
          className="!h-auto !py-1.5 bg-red-500 hover:bg-red-600 text-white border border-red-500 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-600/80 dark:hover:bg-red-600"
        >
          Delete selected {selectedCount ? `(${selectedCount})` : ""}
        </Button>
      </div>
    </div>
  );
};

export default CategoriesHeader;
