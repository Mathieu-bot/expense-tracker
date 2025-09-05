import { useEffect, useState } from "react";
import {
  getAlert,
  getMonthlySummary,
  type MonthlySummary,
  type SummaryAlert,
} from "../services/SummaryService";
import getLastSixMonths from "../utils/getLastSixMonth";
import { DefaultService } from "../api";
import { formatMonth } from "../utils/formatter";

export const useSummaryAlert = () => {
  const [data, setData] = useState<SummaryAlert>({
    alert: false,
    message: "",
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAlert();
        setData(res);
      } catch (error) {
        console.error("Error fetching summary alert:", error);
      }
    };
    fetch();
  }, []);

  return { data: data };
};

export const useMonthlySummary = (month: string) => {
  const [data, setData] = useState<MonthlySummary>({
    totalExpense: 0,
    totalIncome: 0,
    netBalance: 0,
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        console.log(month);

        const res = (await getMonthlySummary(month)) as MonthlySummary;
        setData(res);
      } catch (error) {
        console.error("Failed to fetch summary" + error);
      }
    };

    fetch();
  }, [month]);

  return { data: data };
};

export const useLastSixthMonthSummary = () => {
  const [data, setData] = useState<(MonthlySummary & { month: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const lastSixMonth = getLastSixMonths();

        const responses = await Promise.all(
          lastSixMonth.map(async (m) => {
            const res = await DefaultService.getSummaryMonthly(m);
            return { ...res, month: formatMonth(m) };
          })
        );

        setData(responses);
      } catch (err) {
        console.error("Error", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return { data, loading, error };
};
