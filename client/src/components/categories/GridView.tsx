import { Button, TextField } from "../../ui";
import { Check, X, Edit3, Trash2, Tag } from "lucide-react";
import { formatDate, formatTime, formatCurrencyFull } from "../../utils/formatters";
import { highlightMatch } from "../../utils/highlight";
import type { GridViewProps } from "../../types/Category";
import type { MouseEvent } from "react";

const GridView = ({
  categories,
  editingId,
  editName,
  onEditNameChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onRemove,
  saving,
  highlightQuery,
  totalsThisMonth,
  bulkMode,
  selectedIds,
  onToggleSelect,
  onOpenDetails,
}: GridViewProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((c) => {
        const selected = !!selectedIds?.includes(c.category_id);
        return (
          <div
            key={c.category_id}
            role={bulkMode ? "button" : undefined}
            aria-pressed={bulkMode ? selected : undefined}
            onClick={(e: MouseEvent<HTMLDivElement>) => {
              const t = e.target as HTMLElement;
              if (t.closest("button, a, input, textarea")) return;
              if (bulkMode) {
                onToggleSelect?.(c.category_id);
              } else {
                onOpenDetails?.(c);
              }
            }}
            className={[
              "relative overflow-hidden backdrop-blur-xl rounded-2xl border shadow-lg p-4 flex flex-col gap-3 transition-all duration-300",
              selected
                ? "border-accent/50 ring-1 ring-accent/40 bg-accent/10"
                : "bg-gradient-to-br from-primary-light/10 to-primary-dark/10 border-white/5",
              "hover:ring-1 hover:ring-accent/30 hover:bg-accent/5",
              "cursor-pointer",
            ].join(" ")}
          >
            <div className="pointer-events-none absolute bottom-0 left-0 w-8 h-8 rounded-full bg-accent/10 translate-y-4 translate-x-14 dark:bg-accent/5" />
            <div className="pointer-events-none absolute top-0 left-0 w-12 h-12 rounded-full -translate-y-6 -translate-x-6 bg-cyan-400/10 dark:bg-cyan-400/5" />
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                {editingId === c.category_id ? (
                  <TextField
                    value={editName}
                    onChange={(e) => onEditNameChange(e.target.value)}
                    fullWidth
                    size="small"
                    variant="filled"
                    classes={{
                      input:
                        "!bg-white/10 dark:!bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-xl focus:!ring focus:!ring-primary-light focus:!border-primary-light",
                      label: "hidden",
                    }}
                  />
                ) : (
                  <div className="font-semibold flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-700 dark:bg-white/10 dark:border-white/15 dark:text-light/90">
                      <Tag className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate">
                      {highlightMatch(c.category_name, highlightQuery)}
                      {bulkMode && selected ? (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] rounded bg-accent/20 text-white border border-accent/30">
                          Selected
                        </span>
                      ) : null}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-xs text-light/70 whitespace-nowrap">
                {(() => {
                  const ts = c.updated_at ?? c.created_at;
                  if (!ts) return "";
                  const d = new Date(ts);
                  return `${formatDate(d)} · ${formatTime(d)}`;
                })()}
              </div>
            </div>
            <div className="flex items-center justify-start">
              <span className="px-2 py-0.5 rounded-full bg-accent/15 text-white border border-accent/25 text-xs">
                Total this month: {formatCurrencyFull(totalsThisMonth?.[c.category_id] ?? 0)}
              </span>
            </div>
            <div className="flex items-center justify-end gap-2">
              {editingId === c.category_id ? (
                <>
                  <Button size="small" className="!px-2" onClick={() => onSaveEdit(c.category_id)} disabled={saving} startIcon={<Check className="w-4 h-4" />}>Save</Button>
                  <Button size="small" className="!px-2 bg-gray-200/10 hover:bg-gray-200/20" onClick={onCancelEdit} startIcon={<X className="w-4 h-4" />}>Cancel</Button>
                </>
              ) : (
                <>
                  <Button
                    size="small"
                    onClick={(e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onStartEdit(c); }}
                    aria-label="Edit category"
                    disabled={bulkMode || saving}
                    className="!py-1 bg-cyan-100 hover:bg-cyan-200 dark:bg-white/10 dark:hover:bg-white/20 border border-cyan-200 dark:border-white/15 text-cyan-700 dark:text-light/90 p-2"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="small"
                    onClick={(e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onRemove(c.category_id); }}
                    disabled={bulkMode || saving}
                    aria-label="Delete category"
                    className="!py-1 bg-gradient-to-r from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200 dark:bg-none dark:bg-red-400/15 dark:hover:bg-red-400/25 border border-red-200 dark:border-red-400/20 text-red-600 dark:text-red-400 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GridView;
