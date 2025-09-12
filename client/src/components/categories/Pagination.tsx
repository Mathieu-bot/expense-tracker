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
    <div className="flex items-center justify-between pt-6">
      <div className="flex items-center gap-2 select-none">
        <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-accent text-white border border-accent/30 shadow-sm text-sm dark:bg-accent/25 dark:text-light dark:border-white/20">
          {currentPage}
        </span>
        <span className="text-sm text-primary-dark/60 dark:text-light/60">/</span>
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/70 text-primary-dark border border-primary-dark/20 shadow-sm dark:bg-white/10 dark:text-light dark:border-white/20">
          {totalPages}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={onPrev}
          disabled={currentPage === 1}
          startIcon={<ChevronLeft size={14} />}
          className="px-3 py-1 rounded-lg bg-white/60 hover:bg-white/80 text-primary-dark border border-primary-dark/20 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-white/10 dark:hover:bg-white/15 dark:text-light dark:border-white/20"
          size="small"
        >
          Prev
        </Button>
        <Button
          onClick={onNext}
          disabled={currentPage === totalPages}
          endIcon={<ChevronRight size={14} />}
          className="px-3 py-1 rounded-lg bg-white/60 hover:bg-white/80 text-primary-dark border border-primary-dark/20 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-white/10 dark:hover:bg-white/15 dark:text-light dark:border-white/20"
          size="small"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Pagination;