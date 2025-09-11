import { useRef, useState } from "react";
import { ChevronDown, TrendingUp } from "lucide-react";
import { Button } from "../../../ui";
import { useClickOutside } from "../../../hooks/useClickOutside";

interface SortFilterProps {
  sortOrder: "recent" | "oldest";
  onSortChange: (order: "recent" | "oldest") => void;
}

export const SortFilter = ({ sortOrder, onSortChange }: SortFilterProps) => {
  const [showSortOptions, setShowSortOptions] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useClickOutside(sortRef as React.RefObject<HTMLElement>, () =>
    setShowSortOptions(false)
  );

  return (
    <div className="relative" ref={sortRef}>
      <Button
        onClick={() => setShowSortOptions(!showSortOptions)}
        className="
          bg-gradient-to-br from-accent/25 to-accent/20 bg-white/80
          text-amber-800/90
          dark:bg-white/5 dark:hover:bg-white/10 dark:text-light/90
          border border-accent/30 dark:border-white/10
          hover:shadow-md transition-all
        "
        endIcon={
          <ChevronDown
            className="w-4 h-4 transition-transform text-amber-800/90 dark:text-light/70"
            style={{
              transform: showSortOptions ? "rotate(180deg)" : "none",
            }}
          />
        }
      >
        {sortOrder === "recent" ? "Recent" : "Oldest"}
      </Button>

      {showSortOptions && (
        <div className="absolute top-full overflow-hidden right-0 mt-2 w-40 bg-white/95 dark:bg-primary-dark/95 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 z-50 shadow-2xl animate-in fade-in-80">
          <button
            onClick={() => {
              onSortChange("recent");
              setShowSortOptions(false);
            }}
            className="w-full px-4 border-none py-4 hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-200 text-left text-sm text-gray-800 dark:text-light flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4 text-gray-600 dark:text-light/70" />
            Recent First
          </button>
          <button
            onClick={() => {
              onSortChange("oldest");
              setShowSortOptions(false);
            }}
            className="w-full border-none px-4 py-4 hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-200 text-left text-sm text-gray-800 dark:text-light flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4 rotate-180 text-gray-600 dark:text-light/70" />
            Oldest First
          </button>
        </div>
      )}
    </div>
  );
};
