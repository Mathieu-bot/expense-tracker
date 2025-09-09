import React, { useMemo, useState, type SetStateAction } from "react";
import { useAIAdvice } from "../../hooks/useAiAdvice";
import { Expand, Lightbulb, RefreshCcw, X } from "lucide-react";

type AIAdviceProps = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};
export default function AIAdvice({ open, setOpen }: AIAdviceProps) {
  const { data, loading, error, refetch } = useAIAdvice();

  const [minimized, setMinimized] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const shortText = useMemo(() => {
    const limit = 160;
    if (!data) return "";
    if (showMore || data.length <= limit) return data;
    return data.slice(0, limit).trimEnd() + "…";
  }, [data, showMore]);

  return (
    <section
      className={`${
        open
          ? "fixed bottom-10 right-36 z-[9999] w-[min(90vw,28rem)] max-w-[28rem] rounded-2xl border border-gray-300/70 dark:border-white/10 shadow-lg bg-white/90 dark:bg-gray-900/80 backdrop-blur text-gray-800 dark:text-gray-100"
          : "hidden"
      }`}
      role={error ? "alert" : "status"}
      aria-live="polite"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Lightbulb />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">Smart Tips</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {loading ? "Thinking…" : error ? "Error" : "Ready"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => refetch()}
            className="px-2 py-1 text-xs rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Refresh tips"
            aria-label="Refresh tips"
            disabled={loading}
          >
            <RefreshCcw size={16} />
          </button>
          <button
            type="button"
            onClick={() => setMinimized((v) => !v)}
            className="px-2 py-1 text-xs rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            title={minimized ? "Expand" : "Minimize"}
            aria-label={minimized ? "Expand tips" : "Minimize tips"}
          >
            {minimized ? <Expand size={16} /> : "–"}
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
            }}
            className="px-2 py-1 text-xs rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Close"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      {!minimized && (
        <div className="px-4 pb-4">
          {loading ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Generating your answers</span>
              <span className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          ) : error ? (
            <div className="text-sm">
              <p className="text-red-600 dark:text-red-400">
                {error || "An unexpected error occurred."}
              </p>
              <div className="mt-2">
                <button
                  onClick={() => refetch()}
                  className="text-xs rounded-md border px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm leading-relaxed">
              <p>{shortText || "No tips yet."}</p>
              {data && data.length > 160 && (
                <button
                  className="mt-2 text-xs underline text-blue-600 dark:text-blue-400"
                  onClick={() => setShowMore((v) => !v)}
                >
                  {showMore ? "Show less" : "More"}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
