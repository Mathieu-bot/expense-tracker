import { Outlet } from "react-router-dom";
import BackgroundImage from "./BackgroundImage";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  return (
    <>
      <BackgroundImage />
      {/* <Sidebar /> */}
      <Outlet />
    </>
  );
}
