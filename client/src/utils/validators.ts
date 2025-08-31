import type { IncomeFormData } from "../types/Income";

export const validateIncomeData = (data: IncomeFormData) => {
  const errors: Record<string, string> = {};

  const amount = data.amount;
  if (isNaN(amount) || amount <= 0) {
    errors.amount = "Amount must be greater than 0";
  }

  if (data.source && data.source.length > 100) {
    errors.source = "Source cannot exceed 100 characters";
  }

  if (data.description && data.description.length > 500) {
    errors.description = "Description cannot exceed 500 characters";
  }

  return errors;
};

export const validateDateRange = (start?: string, end?: string) => {
  if (!start || !end) return null;

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (startDate > endDate) {
    return "Start date cannot be after end date";
  }
  return null;
};
