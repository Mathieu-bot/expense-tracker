import { useRef, useState } from "react";
import { MoreHorizontal, FileDown } from "lucide-react";
import { Button } from "../../../ui";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { ExportModal } from "../ExportModal";
import type { Income } from "../../../types/Income";

interface MoreActionsDropdownProps {
  onExport: (startDate?: string, endDate?: string) => Promise<boolean>;
  onPreview: (startDate?: string, endDate?: string) => void;
  incomes: Income[];
}

export const MoreActionsDropdown = ({
  onExport,
  incomes,
  onPreview,
}: MoreActionsDropdownProps) => {
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const moreActionsRef = useRef<HTMLDivElement>(null);

  useClickOutside(moreActionsRef as React.RefObject<HTMLElement>, () =>
    setShowMoreActions(false)
  );

  const handleExportClick = () => {
    setShowMoreActions(false);
    setShowExportModal(true);
  };

  return (
    <>
      <div className="relative" ref={moreActionsRef}>
        <Button
          onClick={() => setShowMoreActions(!showMoreActions)}
          className="bg-white/5 hover:bg-white/10 border border-gray-300 dark:border-white/10 text-light/90 transition-all duration-300 hover:shadow-lg"
          startIcon={<MoreHorizontal className="w-4 h-4" />}
        >
          More
        </Button>

        {showMoreActions && (
          <div className="absolute top-full right-0 mt-2 overflow-hidden w-48 bg-white/95 dark:bg-primary-dark/95 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 z-50 shadow-2xl animate-in fade-in-80">
            <button
              onClick={handleExportClick}
              className="w-full px-4 py-3 border-none hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-200 flex items-center gap-3 text-left group"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <FileDown className="w-4 h-4 text-gray-600 dark:text-light/70" />
              </div>
              <span className="text-gray-800 dark:text-light/90 text-sm">
                Export Receipt
              </span>
            </button>
          </div>
        )}
      </div>

      <ExportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={onExport}
        onPreview={onPreview}
        incomes={incomes}
      />
    </>
  );
};
