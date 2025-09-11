import { Button, Select, Tooltip } from "../../ui";
import type { SortOrder, ViewMode } from "../../types/Category";
import { ListFilter, List as ListIcon, LayoutGrid } from "lucide-react";

export type DataHeaderProps = {
  viewMode: ViewMode;
  onToggleView: () => void;
  sortOrder: SortOrder;
  onSortChange: (v: SortOrder) => void;
};

const DataHeader = ({ viewMode, onToggleView, sortOrder, onSortChange }: DataHeaderProps) => {
  const title = viewMode === "list" ? "List" : "Grid";
  const TitleIcon = viewMode === "list" ? ListIcon : LayoutGrid;

  return (
    <div className="flex mb-5">
      <Tooltip
        title="Toggle view"
        className="dark:bg-gray-100 dark:text-gray-900"
        classes={{
          arrow: 'dark:bg-gray-100 bg-gray-900',
        }}
      >
        <Button
          onClick={onToggleView}
          aria-pressed={viewMode === "grid"}
          startIcon={<TitleIcon className="text-accent" size={20} />}
          className="text-accent dark:text-light hover:text-accent transition-colors bg-accent/20 dark:bg-white/10 font-semibold text-xl border !border-white/20 !px-4 !py-2 shadow-sm shadow-black/20 dark:shadow-black/30 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          {title}
        </Button>
      </Tooltip>
      <div className="flex justify-end w-full gap-2">
        <div className="relative w-[150px]">
          <span className="pointer-events-none absolute top-1/2 -translate-y-1/2 px-3">
            <ListFilter className="w-4 h-4 text-amber-500 dark:text-white" />
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
                "!w-full !bg-accent/20 !dark:!bg-white/5 text-primary-dark dark:!text-white rounded-lg !ring-0  h-full !text-sm pl-9",
              icon: "hidden",
              list: "dark:!bg-white/5 backdrop-blur-2xl !border-none",
              option:
                "!text-black dark:!text-light !w-full text-white dark:hover:!bg-white/5 aria-selected:!bg-accent/10",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default DataHeader;