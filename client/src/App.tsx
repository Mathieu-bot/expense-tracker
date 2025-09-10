import { Routes, Route, useLocation } from "react-router-dom";
import { ToastProvider } from "./ui";
import { Incomes } from "./pages/Incomes";
import Sidebar from "./components/common/Sidebar";
import Dashboard from "./pages/Dashboard";
import BackgroundImage from "./components/common/BackgroundImage";
import { EditIncome } from "./pages/EditIncome";
import Mascot from "./components/common/Mascot";
import RequireAuth from "./components/common/RequireAuth";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AuthCallback from "./pages/AuthCallback";
import { Profile } from "./pages/Profile";
import PostAuthGate from "./components/auth/PostAuthGate";
import Expenses from "./pages/Expenses";
import { CreateExpense } from "./pages/CreateExpense";
import { EditExpense } from "./pages/EditExpense";
import { CreateIncome } from "./pages/CreateIncome";
import { ThemeProvider } from "./contexts/ThemeContext";
import Categories from "./pages/Categories";
import ReceiptPreview from "./pages/ReceiptPreview";
import Header from "./components/common/Header";


function App() {
  const location = useLocation();
  return (
    <ThemeProvider>
      <ToastProvider
        max={4}
        dense={false}
        pauseOnHover={true}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <div className="App min-h-screen relative overflow-x-hidden">
          {location.pathname.includes("/login") ||
          location.pathname.includes("/signup") ? null : (
            <>
              <BackgroundImage />
              <Header />
              <Sidebar />
            </>
          )}
          {location.pathname.includes("/login") ||
          location.pathname.includes("/signup") ? null : (
            <Mascot className="z-50" />
          )}
          {!(
            location.pathname.includes("/login") ||
            location.pathname.includes("/signup")
          ) && <PostAuthGate />}
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected routes */}
            <Route element={<RequireAuth />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/expenses/new" element={<CreateExpense />} />
              <Route path="/expenses/:id/edit" element={<EditExpense />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/receipts/:expenseId" element={<ReceiptPreview />} />
              <Route path="/incomes" element={<Incomes />} />
              <Route path="/incomes/new" element={<CreateIncome />} />
              <Route path="/incomes/:id/edit" element={<EditIncome />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
