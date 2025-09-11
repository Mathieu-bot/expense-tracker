import { Button, TextField } from "../../ui";
import { motion } from "framer-motion";
import { Check, X, Edit3, Trash2, Tag } from "lucide-react";
import { formatDate, formatTime, formatCurrencyFull } from "../../utils/formatters";
import { highlightMatch } from "../../utils/highlight";
import type { ListViewProps } from "../../types/Category";

const ListView = ({
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
}: ListViewProps) => {
  return (
    <motion.ul
      className="space-y-3"
      initial="hidden"
      animate="show"
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
    >
      {categories.map((c) => {
        const selected = !!selectedIds?.includes(c.category_id);
        return (
          <motion.li
            key={c.category_id}
            className="p-0"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            layout
          >
            <div
              role={bulkMode ? "button" : undefined}
              aria-pressed={bulkMode ? selected : undefined}
              onClick={(e) => {
                const t = e.target as HTMLElement;
                if (t.closest("button, a, input, textarea")) return;
                if (bulkMode) {
                  onToggleSelect?.(c.category_id);
                } else {
                  onOpenDetails?.(c);
                }
              }}
              className={[
                "text-primary-dark dark:text-light bg-gradient-to-br from-white/20 to-white/60 dark:from-primary-light/10 dark:to-primary-dark/10 backdrop-blur-lg rounded-xl p-4 border transition-all duration-300 hover:shadow-lg",
                selected
                  ? "border-accent/50 ring-1 ring-accent/40 !bg-accent/5 dark:!bg-accent/10"
                  : "border-cyan-100/50 dark:border-white/15 hover:border-accent/30",
                "hover:ring-1 hover:ring-accent/30 overflow-hidden",
                "cursor-pointer",
              ].join(" ")}
            >
              <div className="pointer-events-none absolute top-0 left-0 w-12 h-12 rounded-full -translate-y-5 -translate-x-5 bg-accent/15 dark:bg-accent/10" />
              <div className="grid grid-cols-1 md:grid-cols-12 items-start md:items-center gap-3">
                <div className="md:col-span-4 flex items-center gap-2">
                  {editingId === c.category_id ? (
                    <TextField
                      value={editName}
                      onChange={(e) => onEditNameChange(e.target.value)}
                      fullWidth
                      size="small"
                      variant="filled"
                      classes={{
                        input:
                          "!bg-black/20 dark:!bg-white/5 backdrop-blur-md border border-white/10 !text-primary-dark dark:!text-white rounded-xl focus:!ring focus:!ring-accent",
                        label: "hidden",
                      }}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-cyan-200 border border-cyan-300 text-cyan-800 dark:bg-white/10 dark:border-white/15 dark:text-light/90">
                        <Tag className="w-3.5 h-3.5" />
                      </span>
                      <span className="font-medium">{highlightMatch(c.category_name, highlightQuery)}{bulkMode && selected ? <span className="ml-2 px-1.5 py-0.5 text-[10px] rounded bg-accent/20 text-primary-dark dark:text-white border border-accent/30">Selected</span> : null}</span>
                    </div>
                  )}
                </div>
                <div className="md:col-span-4 ">
                  <div className="text-sm dark:text-light/80 md:text-center">
                    {(() => {
                      const ts = c.updated_at ?? c.created_at;
                      if (!ts) return "";
                      const d = new Date(ts);
                      return `Updated ${formatDate(d)} at ${formatTime(d)}`;
                    })()}
                  </div>
                  <div className="mt-2 flex items-center justify-start md:justify-center">
                    <span className="px-2 py-0.5 rounded-full bg-accent/15 text-black dark:text-white border border-accent/25 text-xs">
                      Total this month: {formatCurrencyFull(totalsThisMonth?.[c.category_id] ?? 0)}
                    </span>
                  </div>
                </div>
                <div className="md:col-span-4 flex gap-2 justify-start md:justify-end flex-wrap md:flex-nowrap">
                  {editingId === c.category_id ? (
                    <>
                      <Button
                        size="small"
                        className="!px-2 bg-cyan-100 hover:bg-cyan-200 dark:bg-white/10 dark:hover:bg-white/20 border border-cyan-200 dark:border-white/15 text-cyan-700 dark:text-light/90"
                        onClick={() => onSaveEdit(c.category_id)}
                        disabled={saving}
                        startIcon={<Check className="w-4 h-4" />}
                      >
                        Save
                      </Button>
                      <Button
                        size="small"
                        className="!px-2 bg-black/10 dark:bg-gray-200/10 hover:bg-gray-200/20 border border-white/10"
                        onClick={onCancelEdit}
                        startIcon={<X className="w-4 h-4" />}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="small"
                        onClick={() => onStartEdit(c)}
                        disabled={bulkMode || saving}
                        aria-label="Edit category"
                        className=" !py-1 bg-cyan-100 hover:bg-cyan-200 dark:bg-white/10 dark:hover:bg-white/20 border border-cyan-200 dark:border-white/15 text-cyan-700 dark:text-light/90 p-2"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="small"
                        onClick={() => onRemove(c.category_id)}
                        disabled={bulkMode || saving}
                        aria-label="Delete category"
                        className="!h-auto !py-1 bg-gradient-to-r from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200 dark:bg-none dark:bg-red-400/15 dark:hover:bg-red-400/25 border border-red-200 dark:border-red-400/20 text-red-600 dark:text-red-400 p-2"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.li>
        );
      })}
    </motion.ul>
  );
};

export default ListView;
