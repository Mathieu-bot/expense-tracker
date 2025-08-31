import { DefaultService } from "../api";
export type SummaryAlert = {
  alert: boolean;
  message: string;
};
export const getAlert = async (): Promise<SummaryAlert> => {
  const res = await DefaultService.getSummaryAlerts();
  return res as SummaryAlert;
};
