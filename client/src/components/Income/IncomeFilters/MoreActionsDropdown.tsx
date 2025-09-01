import { useRef, useState } from "react";
import { MoreHorizontal, ArrowUp } from "lucide-react";
import { Button } from "../../../ui";
import { useClickOutside } from "../../../hooks/useClickOutside";

export const MoreActionsDropdown = () => {
  const [showMoreActions, setShowMoreActions] = useState(false);
  const moreActionsRef = useRef<HTMLDivElement>(null);

  useClickOutside(moreActionsRef as React.RefObject<HTMLElement>, () =>
    setShowMoreActions(false)
  );

  return (
    <div className="relative" ref={moreActionsRef}>
      <Button
        onClick={() => setShowMoreActions(!showMoreActions)}
        className="bg-white/5 hover:bg-white/10 border border-white/10 text-light/90 transition-all duration-300 hover:shadow-lg"
        startIcon={<MoreHorizontal className="w-4 h-4" />}
      >
        More
      </Button>

      {showMoreActions && (
        <div className="absolute top-full right-0 mt-2 overflow-hidden w-48 bg-primary-dark/95 backdrop-blur-xl rounded-xl border border-white/10 z-50 shadow-2xl animate-in fade-in-80">
          <button className="w-full px-4 py-3 hover:bg-white/5 transition-all duration-200 flex items-center gap-3 text-left group">
            <div className="w-8 h-8 flex items-center justify-center">
              <ArrowUp className="w-4 h-4" />
            </div>
            <span className="text-light/90 text-sm">Export Receipt</span>
          </button>
        </div>
      )}
    </div>
  );
};
