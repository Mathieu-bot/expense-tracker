import { useEffect, useState } from "react";

export function usePersistedState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return initial;
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      // Best-effort persistence only; ignore quota or serialization errors
      console.warn("usePersistedState: failed to persist", err);
    }
  }, [key, state]);

  return [state, setState] as const;
}
