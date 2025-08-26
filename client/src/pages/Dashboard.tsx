import SoldChart from "../components/dashboard/SoldChart";

function Dashboard() {
  return (
    <div className="min-w-screen min-h-screen pl-22 pt-30 px-3 py-5 flex flex-col z-30">
      <div className="grid grid-cols-3">
        <SoldChart
          transactions={[
            { amount: 3500, createdAt: "2025-08-20T10:15:00Z" },
            { amount: 12000, createdAt: "2025-08-22T08:03:00Z" },
          ]}
        />
      </div>
      <div className="grid grid-cols-3"></div>
    </div>
  );
}

export default Dashboard;
