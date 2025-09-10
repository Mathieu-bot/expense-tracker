import { useCallback, useMemo, useState } from "react";

export function useSelection<T, K extends string | number>(items: T[], getId: (item: T) => K) {
  const [bulkMode, setBulkMode] = useState(false);
  const [selected, setSelected] = useState<Set<K>>(new Set());

  const selectedIds = useMemo(() => Array.from(selected.values()), [selected]);

  const toggleBulkMode = useCallback((on?: boolean) => {
    setBulkMode((prev) => (typeof on === "boolean" ? on : !prev));
    if (on === false) setSelected(new Set());
  }, []);

  const isSelected = useCallback((id: K) => selected.has(id), [selected]);

  const toggleSelect = useCallback((id: K) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelected(new Set()), []);

  const selectAll = useCallback(() => {
    const all = new Set<K>();
    for (const it of items) all.add(getId(it));
    setSelected(all);
  }, [items, getId]);

  return { bulkMode, toggleBulkMode, selectedIds, isSelected, toggleSelect, clear, selectAll };
}
