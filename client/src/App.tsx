import { Routes, Route, useLocation } from "react-router-dom";
import { ToastProvider } from "./ui";
import { IncomesPage } from "./pages/IncomesPage";
import Sidebar from "./components/common/Sidebar";
import Dashboard from "./pages/Dashboard";
import BackgroundImage from "./components/common/BackgroundImage";
import { CreateIncomePage } from "./pages/CreateIncomePage";
import { EditIncomePage } from "./pages/EditIncomePage";
import Mascot from "./components/common/Mascot";
import { DashboardHeader } from "./components/common/Header";

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
      <div className="App min-h-screen relative">
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
          <Route path="/incomes" element={<IncomesPage />} />
          <Route path="/incomes/new" element={<CreateIncomePage />} />
          <Route path="/incomes/:id/edit" element={<EditIncomePage />} />
        </Routes>
      </div>
    </ToastProvider>
  );
}

export default App;
