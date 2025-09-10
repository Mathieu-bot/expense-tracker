import { Button, Select } from "../../ui";
import { LayoutGrid, List as ListIcon, Filter } from "lucide-react";
import type { HeaderProps, SortOrder } from "../../types/Category";

export const CategoriesHeader = ({ viewMode, onToggleView, sortOrder, onSortChange, bulkMode, onToggleBulkMode, selectedCount = 0, onBulkDelete }: HeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
      <div className="flex flex-col gap-2 w-full md:w-auto">
        <h1 className="text-4xl font-bold">Categories</h1>
        <p className="text-light/60">Manage your categories</p>
      </div>
      <div className="flex items-center gap-2 self-start md:self-auto w-full md:w-auto">
        <Button
          onClick={onToggleView}
          size="small"
          className="!h-auto !py-1.5 bg-white/10 hover:bg-white/15 !border !border-white/50"
          startIcon={viewMode === "list" ? <LayoutGrid className="w-4 h-4" /> : <ListIcon className="w-4 h-4" />}
        >
          {viewMode === "list" ? "Grid" : "List"}
        </Button>

        <div className="relative w-[150px]">
          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-white/80">
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
              trigger: "!bg-white/10 !text-white !border-white/10 pl-8 placeholder-white/60 !px-2 !py-1.5 !text-sm !pl-8 focus:!ring focus:!ring-primary-light",
              icon: "hidden",
              list: "!bg-white/95 dark:!bg-neutral-900/95 !backdrop-blur-md !border-white/10 !ring-0 p-1",
              option: "!text-gray-900 dark:!text-white hover:!bg-black/10 dark:hover:!bg-white/10 aria-selected:!bg-primary-light/15 dark:aria-selected:!bg-white/10",
            }}
          />
        </div>

        <Button
          onClick={onToggleBulkMode}
          size="small"
          className={"!h-auto !py-1.5 " + (bulkMode ? "bg-accent/20 border border-accent/40" : "bg-white/10 hover:bg-white/15 border border-white/20")}
        >
          {bulkMode ? "Bulk: ON" : "Bulk select"}
        </Button>

        <Button
          onClick={onBulkDelete}
          size="small"
          disabled={!selectedCount}
          className="!h-auto !py-1.5 bg-red-600/80 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Delete selected {selectedCount ? `(${selectedCount})` : ""}
        </Button>
      </div>
    </div>
  );
};

export default CategoriesHeader;
