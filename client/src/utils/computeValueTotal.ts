import type { Expense } from "../types/Expense";
import type { Income } from "../types/Income";

export const computeValueTotal = (valueToCompute: Income[] | Expense[]) => {
  return valueToCompute.reduce((acc, value) => acc + value.amount, 0);
};
