import { useEffect, useState } from "react";
import {
  getAlert,
  getMonthlySummary,
  type MonthlySummary,
  type SummaryAlert,
} from "../services/SummaryService";
import getLastSixMonths from "../utils/getLastSixMonth";
import { DefaultService } from "../api";
import { formatMonth } from "../utils/formatters";
import { useMascotStore } from "../stores/mascotStore";

export const useSummaryAlert = () => {
  const [data, setData] = useState<SummaryAlert>({
    alert: false,
    message: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);

        const res = await getAlert();
        if (res.alert == true) {
          useMascotStore.getState().setExpression("error");
        }
        setData(res);
      } catch (error) {
        setError(error as string);

        console.error("Error fetching summary alert:", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { data: data, loading: loading, error: error };
};

export const useMonthlySummary = (month: string) => {
  const [data, setData] = useState<MonthlySummary>({
    totalExpense: 0,
    totalIncome: 0,
    netBalance: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = (await getMonthlySummary(month)) as MonthlySummary;
        setData(res);
      } catch (error) {
        setError(error as string);
        console.error("Failed to fetch summary" + error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [month]);

  return { data: data, loading: loading, error: error };
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
