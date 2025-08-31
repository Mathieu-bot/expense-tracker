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
        className="bg-white/5 hover:bg-white/10 border border-white/10 text-light/90 hover:shadow-md transition-all"
        endIcon={
          <ChevronDown
            className="w-4 h-4 transition-transform"
            style={{
              transform: showSortOptions ? "rotate(180deg)" : "none",
            }}
          />
        }
      >
        {sortOrder === "recent" ? "Recent" : "Oldest"}
      </Button>

      {showSortOptions && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-primary-dark/95 backdrop-blur-xl rounded-xl border border-white/10 py-2 z-50 shadow-2xl animate-in fade-in-80">
          <button
            onClick={() => {
              onSortChange("recent");
              setShowSortOptions(false);
            }}
            className="w-full px-4 py-2 hover:bg-white/5 transition-all duration-200 text-left text-sm flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Recent First
          </button>
          <button
            onClick={() => {
              onSortChange("oldest");
              setShowSortOptions(false);
            }}
            className="w-full px-4 py-2 hover:bg-white/5 transition-all duration-200 text-left text-sm flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4 rotate-180" />
            Oldest First
          </button>
        </div>
      )}
    </div>
  );
};
