import type { ReactNode } from "react";

export function highlightMatch(
  text: string,
  query?: string,
  highlightClass = "bg-green-300 dark:bg-accent/20 text-primary-dark dark:text-white px-0.5 rounded"
): ReactNode {
  const q = (query ?? "").trim();
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return text;
  const before = text.slice(0, i);
  const match = text.slice(i, i + q.length);
  const after = text.slice(i + q.length);
  return (
    <>
      {before}
      <span className={highlightClass}>{match}</span>
      {after}
    </>
  );
}
