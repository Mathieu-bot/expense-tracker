import CalendarComponent from "../components/dashboard/CalendarComponent";
import SoldChart from "../components/dashboard/SoldChart";
import SpendingPie from "../components/dashboard/SpendingPie";

function Dashboard() {
  return (
    <div className="min-w-screen min-h-screen pl-10 pt-30 py-5 flex flex-col z-30">
      <div className="grid grid-cols-3">
        <SoldChart
          transactions={[
            { amount: 3500, createdAt: "2025-08-20T10:15:00Z" },
            { amount: 12000, createdAt: "2025-08-22T08:03:00Z" },
          ]}
        />
        <SpendingPie />
        <CalendarComponent />
      </div>
      <div className="grid grid-cols-3"></div>
    </div>
  );
}

export default Dashboard;
