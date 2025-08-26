import {
  LayoutDashboard,
  CreditCard,
  DollarSign,
  User,
  LogOut,
} from "lucide-react";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Expenses", icon: CreditCard, href: "/expenses" },
  { label: "Incomes", icon: DollarSign, href: "/incomes" },
  { label: "Profile", icon: User, href: "/profile" },
  { label: "Logout", icon: LogOut, href: "#" },
];

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50">
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
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}