import { Lightbulb } from "lucide-react";
import type { SetStateAction } from "react";

type ShowTipsButtonProps = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  className?: string;
  label?: string;
  showWhenOpen?: boolean;
};
function ShowTipsButton({
  open,
  setOpen,
  className = "",
  label = "Tips",
}: ShowTipsButtonProps) {
  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className={[
        "fixed bottom-10 right-34 z-[888]",
        open ? "hidden" : "inline-flex items-center gap-2",
        "px-4 py-2 rounded-full shadow-lg",
        "bg-gradient-to-r from-blue-600 to-indigo-600",
        "text-white font-medium",
        "hover:brightness-110 active:brightness-95",
        "transition-transform duration-150",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        "dark:from-blue-500 dark:to-indigo-500 dark:focus:ring-offset-gray-900",
        className,
      ].join(" ")}
    >
      <span className="relative">
        <Lightbulb />
      </span>

      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default ShowTipsButton;
