import { assets } from "../../assets/images";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../../hooks/useAuth";
import LogoutButton from "./LogoutButton";

function Header() {
  const { user } = useAuth();
  return (
    <header className="flex justify-between items-center fixed top-3 left-22 bg-gray-300/20 backdrop-blur-2xl rounded-lg px-4 py-2 shadow-md z-10 w-[92%] pr-5 text-white">
      <div className="flex items-center gap-4">
        <p className="text-2xl ">Welcome, {user?.username || user?.firstname || user?.email || "User"}</p>
      </div>

      <div className="flex items-center gap-8">
        <Link to={"/profile"} className="flex items-center gap-2">
          <img
            src={assets.userPlaceholder}
            className="w-10 h-10 object-contain rounded-full"
          />{" "}
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{user?.username || user?.firstname || "User"}</span>
            <span className="text-xs italic">{user?.email || ""}</span>
          </div>
        </Link>
        <ThemeToggle />
        <LogoutButton size="small">Logout</LogoutButton>
      </div>
    </header>
  );
}

export default Header;

