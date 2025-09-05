import {
  LayoutDashboard,
  CreditCard,
  DollarSign,
  User,
  LogOut,
  X,
} from "lucide-react";
import LogoutButton from "./LogoutButton";
import { useState } from "react";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Expenses", icon: CreditCard, href: "/expenses" },
  { label: "Incomes", icon: DollarSign, href: "/incomes" },
  { label: "Profile", icon: User, href: "/profile" },
];

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <div className="hidden lg:block fixed left-0 top-1/2 transform -translate-y-1/2 z-40">
        <div className="group/sidebar relative h-[70vh] max-h-[600px] w-16 hover:w-56 transition-all duration-300">
          <div className="absolute inset-0 rounded-tr-[4rem] rounded-br-[4rem] py-10 overflow-hidden bg-white/10 backdrop-blur-2xl transition-all duration-300">
            <nav className="h-full px-2 py-4">
              <div className="flex h-full flex-col justify-between">
                <div className="flex flex-col gap-3">
                  {items.slice(0, 3).map(({ label, icon: Icon, href }) => (
                    <a
                      key={label}
                      href={href}
                      className="
                        flex items-center gap-3 rounded-xl px-3 py-3
                        hover:bg-white/15 focus:outline-none focus:ring-2 ring-white/30
                        transition-colors text-white
                      "
                      title={label}
                      aria-label={label}
                    >
                      <Icon className="size-5 shrink-0" aria-hidden />
                      <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        {label}
                      </span>
                    </a>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  {items.slice(3).map(({ label, icon: Icon, href }) => (
                    <a
                      key={label}
                      href={href}
                      className="
                        flex items-center gap-3 rounded-xl px-3 py-3
                        hover:bg-white/15 focus:outline-none focus:ring-2 ring-white/30
                        transition-colors text-white
                      "
                      title={label}
                      aria-label={label}
                    >
                      <Icon className="size-5 shrink-0" aria-hidden />
                      <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        {label}
                      </span>
                    </a>
                  ))}

                  <LogoutButton
                    size="large"
                    className="text-left w-full flex items-center !justify-start gap-3 
                      rounded-xl !p-3 hover:bg-white/15 focus:outline-none focus:ring-2 
                      ring-white/30 transition-colors text-white border-none font-normal"
                    startIcon={
                      <LogOut className="size-5 shrink-0" aria-hidden />
                    }
                  >
                    <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Logout
                    </span>
                  </LogoutButton>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 p-3 rounded-full bg-accent/90 text-white shadow-lg hover:bg-accent transition-colors duration-200"
        aria-label="Open menu"
      >
        <LayoutDashboard size={24} />
      </button>

      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          ></div>
          <div className="absolute left-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl transform transition-transform duration-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-white text-xl font-bold">Menu</h2>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 text-white hover:bg-white/10 rounded-lg"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="space-y-3">
                {items.map(({ label, icon: Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setIsMobileOpen(false)}
                    className="
                      flex items-center gap-4 rounded-xl px-4 py-4
                      hover:bg-white/15 focus:outline-none focus:ring-2 ring-white/30
                      transition-colors text-white text-lg
                    "
                  >
                    <Icon className="size-6" />
                    <span>{label}</span>
                  </a>
                ))}

                <div className="pt-4 mt-4 border-t border-white/20">
                  <LogoutButton
                    size="large"
                    className="w-full flex items-center justify-center gap-3 
                      rounded-xl py-4 hover:bg-white/15 text-white border-none font-normal text-lg"
                    startIcon={<LogOut className="size-6" />}
                  >
                    Logout
                  </LogoutButton>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
