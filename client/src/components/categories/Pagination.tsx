import { Button } from "../../ui";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

const Pagination = ({ currentPage, totalPages, onPrev, onNext }: PaginationProps) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center pt-6">
      <div className="flex items-center gap-2">
        <Button
          onClick={onPrev}
          disabled={currentPage === 1}
          startIcon={<ChevronLeft size={14} />}
          className="px-3 py-1 rounded-lg bg-black/30 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 border border-white/20 text-light disabled:opacity-40 disabled:cursor-not-allowed"
          size="small"
        >
          Prev
        </Button>
        <span className="text-sm px-3 py-2 rounded-lg bg-black/20 dark:bg-white/5 text-light dark:text-light/80">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={onNext}
          disabled={currentPage === totalPages}
          endIcon={<ChevronRight size={14} />}
          className="px-3 py-1 rounded-lg bg-black/30 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 border border-white/20 text-light disabled:opacity-40 disabled:cursor-not-allowed"
          size="small"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Pagination;