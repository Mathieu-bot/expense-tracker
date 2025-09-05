import { getMonthlyExpenseSummary } from "../services/report.service.js";

// @desc    Get monthly expense summary (virtualizes recurring expenses)
// @route   GET /api/reports/expenses/monthly?month=YYYY-MM
// @access  Private
export const getMonthlyExpensesReportController = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { month } = req.query; // format: YYYY-MM

    // Determine month boundaries
    let year, monthIndex;
    if (month && /^\d{4}-\d{2}$/.test(month)) {
      const [y, m] = month.split("-");
      year = parseInt(y, 10);
      monthIndex = parseInt(m, 10) - 1; // JS month index
    } else {
      const now = new Date();
      year = now.getFullYear();
      monthIndex = now.getMonth();
    }

    const monthStart = new Date(year, monthIndex, 1, 0, 0, 0, 0);
    const monthEnd = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

    const result = await getMonthlyExpenseSummary(userId, monthStart, monthEnd);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    return res.status(200).json({ success: true, data: result.data });
  } catch (error) {
    console.error("Error in monthly expense report:", error);
    return res
      .status(500)
      .json({ success: false, error: "Server error while building report" });
  }
};
