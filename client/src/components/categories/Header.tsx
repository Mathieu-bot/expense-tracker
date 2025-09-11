import type { HeaderProps } from "../../types/Category";
import { Button, Tooltip } from "../../ui";
import { MousePointerClick as ClickIcon, Hand } from "lucide-react";

export const CategoriesHeader = ({ bulkMode, onToggleBulkMode }: HeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
      <div className="flex flex-col gap-2 w-full md:w-auto">
        <h1 className="dark:text-light text-primary-dark/90 text-4xl font-bold">Categories</h1>
        <p className="text-primary-dark/80 dark:text-light/60">Manage your categories</p>
      </div>
      <div className="flex items-center gap-2 self-start md:self-auto w-full md:w-auto">
        <Tooltip
          title={bulkMode ? "Bulk mode is ON" : "Enable bulk selection"}
          className="dark:bg-gray-100 dark:text-gray-900"
          classes={{ arrow: "dark:bg-gray-100 bg-gray-900" }}
        >
          <Button
            aria-pressed={bulkMode}
            onClick={onToggleBulkMode}
            className={[
              "group shadow-md backdrop-blur-xl",
              "rounded-full px-4 py-2 border transition-all",
              bulkMode
                ? "bg-accent text-white border-accent/30 hover:bg-accent/90"
                : "bg-white/60 hover:bg-white/80 text-primary-dark border-primary-dark/20 dark:bg-white/10 dark:hover:bg-white/15 dark:text-light dark:border-white/20",
            ].join(" ")}
            startIcon={bulkMode ? <Hand className="w-4 h-4" /> : <ClickIcon className="w-4 h-4" />}
          >
            <span className="font-semibold">{bulkMode ? "Bulk ON" : "Bulk select"}</span>
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default CategoriesHeader;
