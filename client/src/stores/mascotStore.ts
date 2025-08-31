import { create } from "zustand";
import type { MascotStore, MascotExpression } from "../types/Mascot";

export const useMascotStore = create<MascotStore>((set) => ({
  expression: "idle",
  setExpression: (expression: MascotExpression) => set({ expression }),
  resetExpression: () => set({ expression: "idle" }),
}));
