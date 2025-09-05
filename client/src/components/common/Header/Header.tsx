// DashboardHeader.tsx
import { assets } from "../../../assets/images";
import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import {
  ChevronDown,
  LayoutDashboard,
  CreditCard,
  DollarSign,
  User,
  LogOut,
} from "lucide-react";
import {
  DateDropdown,
  MobileMenu,
  NotificationBell,
  SearchInput,
} from "./components";
import { useState, useEffect } from "react";
import { useUserStore } from "../../../stores/userStore";
import LogoutButton from "../LogoutButton";

const DashboardHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, loading, error, fetchProfile } = useUserStore();

  // Navigation items
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { label: "Expenses", icon: CreditCard, href: "/expenses" },
    { label: "Incomes", icon: DollarSign, href: "/incomes" },
    { label: "Profile", icon: User, href: "/profile" },
  ];

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.querySelector(".mobile-menu-overlay");
      const menuButton = document.querySelector(".mobile-menu-button");

      if (
        isMobileMenuOpen &&
        mobileMenu &&
        !mobileMenu.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  const getUserDisplayName = () => {
    if (loading) return "Loading...";
    if (error || !user) return "GUEST";
    return user.firstname && user.lastname
      ? `${user.firstname} ${user.lastname}`
      : user.firstname || user.lastname || user.username || "User";
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

  const shouldShowGlassmorphism = isMobile || isScrolled;

  return (
    <>
      <header
        className={`flex justify-between items-center fixed top-4 left-4 right-4 lg:left-25 lg:right-10 z-50 px-4 lg:px-6 py-3 rounded-2xl transition-all duration-500 ${
          shouldShowGlassmorphism
            ? "bg-white/10 backdrop-blur-sm shadow-lg border border-white/10"
            : "bg-transparent border border-transparent"
        }`}
      >
        {/* Left section - Logo and Mobile Menu */}
        <div className="flex items-center gap-4">
          <div className="mobile-menu-button">
            <MobileMenu
              isOpen={isMobileMenuOpen}
              onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>

          <div className="hidden lg:flex lg:flex-col">
            <h1 className="text-2xl font-bold text-white">
              {getWelcomeMessage()}
              {user && (
                <span className="bg-accent bg-clip-text text-transparent">
                  {getUserDisplayName().split(" ")[0]}
                </span>
              )}
            </h1>
            <p className="text-indigo-100/90 font-light text-sm">
              Track all your transactions with PennyPal
            </p>
          </div>
        </div>

        {/* Center section - Search (hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-6">
          <DateDropdown />
          <SearchInput placeholder="Search transactions..." />
        </div>

        {/* Right section - Desktop features */}
        <div className="hidden lg:flex items-center gap-5">
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
                className={`w-10 h-10 lg:w-13 lg:h-13 object-cover relative z-10 group-hover:border-amber-200/50 transition-all duration-300 rounded-full ${
                  !user ? "opacity-70 grayscale" : ""
                }`}
                alt="Profile"
              />
              {user && (
                <div className="absolute bottom-0 right-0 w-3 h-3 lg:w-3.5 lg:h-3.5 bg-green-400 rounded-full border-2 border-white z-20"></div>
              )}
            </div>

            <div className="hidden lg:flex flex-col">
              <span className="text-sm font-semibold text-white group-hover:text-amber-100 transition-colors duration-300">
                {getUserDisplayName()}
              </span>
              <span className="text-xs text-white/70 group-hover:text-amber-100/80 transition-colors duration-300">
                @{getUsername()}
              </span>
            </div>

            <ChevronDown
              className="hidden lg:block text-white/70 group-hover:text-white transition-colors duration-200"
              size={16}
            />
          </Link>
        </div>

        {/* Mobile right section - Only show profile and notifications */}
        <div className="flex lg:hidden items-center gap-3">
          <NotificationBell hasNotifications={true} notifNumber={3} />
          <Link
            to={user ? "/profile" : "/login"}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <img
                src={assets.userPlaceholder}
                className={`w-10 h-10 object-cover rounded-full ${
                  !user ? "opacity-70 grayscale" : ""
                }`}
                alt="Profile"
              />
              {user && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              )}
            </div>
          </Link>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay fixed inset-0 z-[500000] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div
            className="absolute left-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 h-full flex flex-col">
              {/* Header with user info */}
              <div className="flex items-center gap-3 mb-8">
                <img
                  src={assets.userPlaceholder}
                  className="w-12 h-12 rounded-full"
                  alt="Profile"
                />
                <div>
                  <h2 className="text-white font-semibold">
                    {getUserDisplayName()}
                  </h2>
                  <p className="text-gray-400 text-sm">@{getUsername()}</p>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 space-y-2 mb-6">
                {navItems.map(({ label, icon: Icon, href }) => (
                  <Link
                    key={label}
                    to={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 rounded-xl px-4 py-3 hover:bg-white/15 transition-colors duration-200 text-white"
                  >
                    <Icon size={20} />
                    <span className="text-lg">{label}</span>
                  </Link>
                ))}
              </nav>

              {/* Features Section */}
              <div className="space-y-4 mb-6">
                <div className="mb-4">
                  <SearchInput placeholder="Search transactions..." />
                </div>

                <div className="p-3 bg-white/10 rounded-xl">
                  <DateDropdown />
                </div>

                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
              </div>

              {/* Logout Button */}
              <div className="mt-auto pt-4 border-t border-white/20">
                <LogoutButton
                  size="large"
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl hover:bg-white/15 transition-colors duration-200 text-white"
                  startIcon={<LogOut size={20} />}
                >
                  Logout
                </LogoutButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardHeader;
