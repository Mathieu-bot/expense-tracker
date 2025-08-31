import { Outlet } from "react-router-dom";
import BackgroundImage from "./BackgroundImage";
import DashboardHeader from "./Header";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  return (
    <>
      <BackgroundImage />
      <DashboardHeader />
      <Sidebar />
      <Outlet />
    </>
  );
}
