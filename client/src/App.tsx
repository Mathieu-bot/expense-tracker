import { Routes, Route, useLocation } from "react-router-dom";
import { ToastProvider } from "./ui";
import { Incomes } from "./pages/Incomes";
import Sidebar from "./components/common/Sidebar";
import Dashboard from "./pages/Dashboard";
import BackgroundImage from "./components/common/BackgroundImage";
import { CreateIncome } from "./pages/CreateIncome";
import { EditIncome } from "./pages/EditIncome";
import Mascot from "./components/common/Mascot";
import { DashboardHeader } from "./components/common/Header";
import { Profile } from "./pages/Profile";

function App() {
  /*
    TODO: check auth then redirect to /login when not authenticated
    TODO: use different layout for auth page and dashboard page
  */
  const location = useLocation();
  return (
    <ToastProvider
      max={4}
      dense={false}
      pauseOnHover={true}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <div className="App min-h-screen relative overflow-x-hidden">
        {location.pathname.includes("/login") ||
        location.pathname.includes("/register") ? null : (
          <>
            <BackgroundImage />
            <DashboardHeader />
            <Sidebar />
          </>
        )}
        <Mascot className="z-50" />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/incomes" element={<Incomes />} />
          <Route path="/incomes/new" element={<CreateIncome />} />
          <Route path="/incomes/:id/edit" element={<EditIncome />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </ToastProvider>
  );
}

export default App;
