import type { Income } from "../types/Income";

export const computeValueTotal = (valueToCompute: Income[]) => {
  return valueToCompute.reduce((acc, value) => acc + value.amount, 0);
};
