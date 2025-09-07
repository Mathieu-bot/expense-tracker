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
  X,
  Menu,
} from "lucide-react";
import { DateDropdown, NotificationBell, SearchInput } from "./components";
import { useState, useEffect, useRef } from "react";
import { useUserStore } from "../../../stores/userStore";
import LogoutButton from "../LogoutButton";

const DashboardHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { user, loading, error, fetchProfile } = useUserStore();

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { label: "Expenses", icon: CreditCard, href: "/expenses" },
    { label: "Incomes", icon: DollarSign, href: "/incomes" },
    { label: "Profile", icon: User, href: "/profile" },
  ];

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isMobileMenuOpen]);

  const openMenu = () => {
    setIsMobileMenuOpen(true);
    setTimeout(() => {
      setIsAnimating(true);
    }, 10);
  };

  const closeMenu = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 300);
  };

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
            ? "bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/70 text-gray-800 dark:bg-white/10 dark:border-white/10 dark:text-white"
            : "bg-transparent border border-transparent text-white"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="mobile-menu-button" ref={buttonRef}>
            <button
              onClick={openMenu}
              className={`p-2 border-none rounded-lg backdrop-blur-sm border transition-colors duration-200 lg:hidden ${shouldShowGlassmorphism
          ? "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800/20 dark:hover:bg-gray-400/30 dark:text-white"
          : "bg-white/10 hover:bg-white/20 text-white"
      }`}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="hidden lg:flex lg:flex-col">
            <h1 className="text-2xl font-bold">
              {getWelcomeMessage()}
              {user && (
                <span className= {`bg-clip-text text-transparent ${shouldShowGlassmorphism ? "bg-accent " : "bg-[#ffdd33]"}`}>
                  {getUserDisplayName().split(" ")[0]}
                </span>
              )}
            </h1>
            <p
              className={`font-light text-sm ${
                shouldShowGlassmorphism
                  ? "text-gray-900 dark:text-indigo-100/90"
                  : "text-white/90"
              }`}
            >
              Track all your transactions with PennyPal
            </p>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-6">
          <DateDropdown shouldShowGlassmorphism={shouldShowGlassmorphism} />
          <SearchInput
            placeholder="Search transactions..."
            shouldShowGlassmorphism={shouldShowGlassmorphism}
          />
        </div>

        <div className="hidden lg:flex items-center gap-5">
          <ThemeToggle shouldShowGlassmorphism={shouldShowGlassmorphism} />
          <NotificationBell
            hasNotifications={true}
            notifNumber={3}
            shouldShowGlassmorphism={shouldShowGlassmorphism}
          />

          <div
            className={`h-8 w-px ${
              shouldShowGlassmorphism ? "bg-gray-300" : "bg-white/30"
            }`}
          ></div>

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
              <span
                className={`text-sm font-semibold group-hover:text-primary transition-colors duration-300 ${
                  shouldShowGlassmorphism
                    ? "text-gray-800 dark:text-white dark:group-hover:text-amber-100"
                    : "text-white group-hover:text-amber-100 dark:text-white dark:group-hover:text-amber-100"
                }`}
              >
                {getUserDisplayName()}
              </span>
              <span
                className={`text-xs group-hover:text-primary/80 transition-colors duration-300 ${
                  shouldShowGlassmorphism
                    ? "text-gray-600 dark:text-white/70 dark:group-hover:text-amber-100/80"
                    : "text-white/70 group-hover:text-amber-100/80 dark:text-white/70 dark:group-hover:text-amber-100/80"
                }`}
              >
                @{getUsername()}
              </span>
            </div>

            <ChevronDown
              className={`hidden lg:block group-hover:text-gray-700 transition-colors duration-200 ${
                shouldShowGlassmorphism
                  ? "text-gray-500 dark:text-white/70 dark:group-hover:text-white"
                  : "text-white/70 group-hover:text-white"
              }`}
              size={16}
            />
          </Link>
        </div>

        <div className="flex lg:hidden items-center gap-3">
          <ThemeToggle shouldShowGlassmorphism={shouldShowGlassmorphism} />
          <NotificationBell
            hasNotifications={true}
            notifNumber={3}
            shouldShowGlassmorphism={shouldShowGlassmorphism}
          />
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

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden">
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
              isAnimating ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeMenu}
          />
          <div
            ref={menuRef}
            className={`absolute left-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 dark:bg-gradient-to-b dark:from-primary-dark dark:to-primary ${
              isAnimating ? "translate-x-0" : "-translate-x-full"
            }`}
            style={{ zIndex: 10000 }}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <img
                    src={assets.userPlaceholder}
                    className="w-12 h-12 rounded-full"
                    alt="Profile"
                  />
                  <div>
                    <h2 className="text-gray-800 font-semibold dark:text-white">
                      {getUserDisplayName()}
                    </h2>
                    <p className="text-gray-500 text-sm dark:text-gray-400">
                      @{getUsername()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeMenu}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200 dark:text-white dark:hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex-1 space-y-3 mb-8">
                {navItems.map(({ label, icon: Icon, href }) => (
                  <Link
                    key={label}
                    to={href}
                    onClick={closeMenu}
                    className="flex items-center gap-4 rounded-xl px-4 py-4 hover:bg-gray-100 transition-all duration-200 text-gray-700 dark:text-white dark:hover:bg-white/15"
                  >
                    <Icon size={22} />
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-6 border-t border-gray-200 dark:border-white/20">
                <LogoutButton
                  size="large"
                  className="w-full flex items-center justify-center gap-3 py-7 border-none rounded-xl hover:bg-gray-100 transition-colors duration-200 text-gray-700 dark:text-white dark:hover:bg-white/15"
                  startIcon={<LogOut size={22} />}
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
