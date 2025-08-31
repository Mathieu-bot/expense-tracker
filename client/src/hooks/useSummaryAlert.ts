import { useEffect, useState } from "react";
import { getAlert, type SummaryAlert } from "../services/SummaryService";

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
