import summaryService from "../services/summary.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getSummaryBetweenCustomPeriod = asyncHandler(async (req, res) => {
  const { user_id } = req.user;
  const { start, end } = req.query;

  try {
    const summary = await summaryService.getSummaryBetweenCustomPeriod(
      user_id,
      start,
      end
    );
    res.status(200).json(summary);
  } catch (error) {
    console.error("Error fetching summary:", error);
    return res.status(500).json({ error: "Failed to fetch summary" });
  }
});

export const getSummaryForAMonth = asyncHandler(async (req, res) => {
  const { user_id } = req.user;
  const { date } = req.query;

  try {
    const [year, month] = date.split("-");
    const summary = await summaryService.getSummaryForAMonth(
      user_id,
      month,
      year
    );
    res.status(200).json(summary);
  } catch (error) {
    console.error("Error fetching monthly summary:", error);
    return res.status(500).json({ error: "Failed to fetch monthly summary" });
  }
});
export const getAlert = asyncHandler(async (req, res) => {
  const { user_id } = req.user;
  try {
    const summary = await summaryService.getAlert(user_id);
    res.status(200).json(summary);
  } catch (error) {
    console.error("Error fetching alert:", error);
    return res.status(500).json({ error: "Failed to fetch alert" });
  }
});
