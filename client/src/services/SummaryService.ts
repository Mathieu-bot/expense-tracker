import { DefaultService } from "../api";

export type SummaryAlert = {
  alert: boolean;
  message: string;
};
export type MonthlySummary = {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
};
export const getAlert = async (): Promise<SummaryAlert> => {
  try {
    const res = await DefaultService.getSummaryAlerts();
    return res as SummaryAlert;
  } catch (error) {
    console.error("Error" + error);
    return { alert: false, message: "Failed to fetch alert" };
  }
};

export const getMonthlySummary = async (
  month: string
): Promise<void | MonthlySummary> => {
  try {
    const res = await DefaultService.getSummaryMonthly(month);
    return res as MonthlySummary;
  } catch (error) {
    console.error("Error" + error);
  }
};
