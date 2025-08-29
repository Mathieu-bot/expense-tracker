import { assets } from "../../../assets/images";
import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import { ChevronDown } from "lucide-react";
import { DateDropdown, NotificationBell, SearchInput } from "./components";
import { useState, useEffect } from "react";
import { useUserStore } from "../../../stores/userStore";

const DashboardHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, loading, error, fetchProfile } = useUserStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getUserDisplayName = () => {
    if (loading) return "Loading...";
    if (error || !user) return "GUEST";

    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`;
    }
    if (user.firstname) return user.firstname;
    if (user.lastname) return user.lastname;
    if (user.username) return user.username;

    return "User";
  };

  const getUsername = () => {
    if (loading) return "Loading...";
    if (error || !user) return "guest";
    return user.username;
  };

  const getWelcomeMessage = () => {
    if (loading) return "Welcome back!";
    if (error || !user) return "Welcome, Guest!";
    return `Hi, `;
  };

  return (
    <header
      className={`flex justify-between items-center fixed top-4 left-25 right-10 z-30 px-6 py-3 rounded-2xl transition-all duration-500 ${
        isScrolled ? "bg-white/10 backdrop-blur-sm shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-white">
          {getWelcomeMessage()}
          {user && (
            <span className="bg-accent bg-clip-text text-transparent">
              {getUserDisplayName().split(" ")[0]}
            </span>
          )}
        </h1>
        <p className="text-indigo-100/90 font-light">
          Track all your transactions with PennyPal
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-6">
          <DateDropdown />
          <SearchInput />
        </div>

        <div className="flex items-center gap-5">
          <ThemeToggle />
          <NotificationBell hasNotifications={true} notifNumber={3} />

          <div className="h-8 w-px bg-white/30"></div>

          <Link
            to={user ? "/profile" : "/login"}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <img
                src={assets.userPlaceholder}
                className={`w-13 h-13 object-cover relative z-10 group-hover:border-amber-200/50 transition-all duration-300 rounded-full ${
                  !user ? "opacity-70 grayscale" : ""
                }`}
                alt="Profile"
              />
              {user && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white z-20"></div>
              )}
              {!user && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-gray-400 rounded-full border-2 border-white z-20"></div>
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white group-hover:text-amber-100 transition-colors duration-300">
                {getUserDisplayName()}
              </span>
              <span className="text-xs text-white/70 group-hover:text-amber-100/80 transition-colors duration-300">
                @{getUsername()}
              </span>
            </div>

            <ChevronDown
              className="text-white/70 group-hover:text-white transition-colors duration-200"
              size={16}
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
