import { Dialog, Button, Skeleton } from "../../../ui";
import type { Category } from "../../../types/Auth";
import { Tag, ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react";
import { formatCurrency, formatCurrencyFull, formatDate } from "../../../utils/formatters";
import { useExpenses } from "../../../hooks/useExpenses";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom"; 
import type { Expense } from "../../../types/Expense";

type Props = {
  open: boolean;
  onClose: () => void;
  category: Category | null;
  totalThisMonth?: number;
  onEdit?: (c: Category) => void;
  onDelete?: (c: Category) => void;
};

const CategoryDetailsModal = ({ open, onClose, category, totalThisMonth, onEdit, onDelete }: Props) => {
  // hooks must be called unconditionally
  const navigate = useNavigate();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const fmtLocal = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const toTime = (value: string | Date | null | undefined) => {
    if (!value) return 0;
    return value instanceof Date ? value.getTime() : new Date(value).getTime();
  };

  // fetch data
  const { expenses: catAll, loading: loadingCatAll, refetch: refetchCatAll } = useExpenses(undefined, undefined, category?.category_name);
  const { expenses: allThisMonth, loading: loadingAllThis, refetch: refetchAllThis } = useExpenses(fmtLocal(monthStart), fmtLocal(monthEnd));
  const { expenses: catPrevMonth, loading: loadingPrev, refetch: refetchCatPrev } = useExpenses(fmtLocal(prevStart), fmtLocal(prevEnd), category?.category_name);

  useEffect(() => {
    if (!open || !category) return;
    void refetchCatAll();
    void refetchAllThis();
    void refetchCatPrev();
    // intentionally rely on the refetch functions from hooks
  }, [open, category, refetchAllThis, refetchCatAll, refetchCatPrev]);

  const totals = useMemo(() => {
    const sum = (arr: Expense[]) => arr.reduce((acc, e) => acc + Number(e.amount || 0), 0);
    const tAllThis = sum(allThisMonth);
    const tCatThis = Number(totalThisMonth) || 0;
    const tCatPrev = sum(catPrevMonth);
    const share = tAllThis > 0 ? (tCatThis / tAllThis) * 100 : 0;
    const variation = tCatPrev > 0 ? ((tCatThis - tCatPrev) / tCatPrev) * 100 : (tCatThis > 0 ? 100 : 0);
    const lastFive = [...catAll]
      .sort((a, b) => toTime(b.date) - toTime(a.date))
      .slice(0, 5);
    return { tAllThis, tCatThis, tCatPrev, share, variation, lastFive };
  }, [allThisMonth, totalThisMonth, catPrevMonth, catAll]);

  const isLoading = loadingCatAll || loadingAllThis || loadingPrev;

  if (!open || !category) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 dark:bg-white/10 dark:text-white/90 border border-cyan-200 dark:border-white/15">
            <Tag className="w-4 h-4" />
          </span>
          <span className="text-lg font-bold dark:text-accent text-primary-light">CATEGORY DETAILS</span>
        </div>
      }
      classes={{
        panel: "bg-white/95 dark:bg-primary-light/20 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl",
        header: "border-b border-gray-200 dark:border-gray-700",
        body: "text-gray-700 dark:text-gray-200",
        footer: "border-t border-gray-200 dark:border-gray-700",
        close: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center",
        overlay: "backdrop-blur-md",
      }}
      footer={
        <div className="flex items-center justify-end gap-2">
          {onEdit && (
            <Button size="small" className="bg-cyan-100 hover:bg-cyan-200 dark:bg-white/10 dark:hover:bg-white/20 border border-cyan-200 dark:border-white/15 text-cyan-700 dark:text-light/90" onClick={() => onEdit(category)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button size="small" className="bg-red-600 text-white hover:bg-red-700" onClick={() => onDelete(category)}>
              Delete
            </Button>
          )}
        </div>
      }
    >
      <div className="relative z-10 space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-light/95 truncate">{category.category_name}</h3>
            <p className="text-sm text-gray-500 dark:text-light/60">
              {category.updated_at ? (
                <>Updated {formatDate(new Date(category.updated_at))}</>
              ) : category.created_at ? (
                <>Created {formatDate(new Date(category.created_at))}</>
              ) : null}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {isLoading ? (
            <>
              <Skeleton width={150} height={28} rounded="rounded-md" className="bg-white/40 dark:bg-white/10 border border-black/10 dark:border-white/10" />
              <Skeleton width={140} height={28} rounded="rounded-md" className="bg-white/40 dark:bg-white/10 border border-black/10 dark:border-white/10" />
            </>
          ) : (
            <>
              <span className="px-3 py-1 rounded-md bg-accent/15 text-black dark:text-white border border-accent/25 text-xs">
                Total this month: {formatCurrencyFull(totals.tCatThis || 0)}
              </span>
              {totals.share >= 0 && (
                <span className="px-3 py-1 rounded-md bg-black/5 dark:bg-white/10 text-xs border border-black/10 dark:border-white/10">
                  Share: {totals.share.toFixed(1)}%
                </span>
              )}
              {Number.isFinite(totals.variation) && (
                <span className={[
                  "px-3 py-1 rounded-md text-xs border inline-flex items-center gap-1",
                  totals.variation >= 0
                    ? "bg-green-500/10 border-green-500/20 text-green-600"
                    : "bg-red-500/10 border-red-500/20 text-red-600",
                ].join(" ")}>
                  {totals.variation >= 0 ? <ArrowUpRight className="w-3 h-3"/> : <ArrowDownRight className="w-3 h-3"/>}
                  {Math.abs(totals.variation).toFixed(1)}% vs last month
                </span>
              )}
              {category.user_id == null && (
                <span className="px-3 py-1 rounded-md bg-black/5 dark:bg-white/10 text-xs border border-black/10 dark:border-white/10">
                  Default category
                </span>
              )}
            </>
          )}
        </div>

        <div className="rounded-xl bg-white/60 dark:bg-white/5 border border-gray-200/70 dark:border-white/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-light/80">Last 5 expenses</h4>
            <button
              onClick={() => navigate(`/expenses?category=${encodeURIComponent(category.category_name)}`)}
              className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-md bg-accent/15 border border-accent/25 text-black dark:text-white hover:bg-accent/25"
            >
              Go to expenses <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          {isLoading ? (
            <ul className="divide-y divide-gray-200/70 dark:divide-white/10">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="py-2 flex items-center justify-between text-sm">
                  <Skeleton variant="rect" width="50%" height={16} rounded="rounded" className="mr-2 bg-white/50 dark:bg-white/10" />
                  <div className="flex items-center gap-3 whitespace-nowrap text-right">
                    <Skeleton variant="rect" width={80} height={16} rounded="rounded" className="bg-white/50 dark:bg-white/10" />
                    <Skeleton variant="rect" width={96} height={16} rounded="rounded" className="bg-white/50 dark:bg-white/10" />
                  </div>
                </li>
              ))}
            </ul>
          ) : totals.lastFive.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-light/60">No expenses yet for this category.</div>
          ) : (
            <ul className="divide-y divide-gray-200/70 dark:divide-white/10">
              {totals.lastFive.map((e: Expense) => (
                <li key={e.expense_id} className="py-2 flex items-center justify-between text-sm">
                  <div className="min-w-0 mr-2 truncate text-gray-700 dark:text-light/85">{e.description || "(No description)"}</div>
                  <div className="flex items-center gap-3 whitespace-nowrap text-right">
                    <span className="text-gray-500 dark:text-light/60">{e.date ? formatDate(new Date(e.date)) : "—"}</span>
                    <span className="font-medium text-cyan-700 dark:text-light/90">{formatCurrency(Number(e.amount) || 0)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Dialog>
  );
}
;

export default CategoryDetailsModal;
