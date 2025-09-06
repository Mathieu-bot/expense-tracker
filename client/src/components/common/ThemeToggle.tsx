import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const ThemeToggle: React.FC<{ shouldShowGlassmorphism: boolean }> = ({
  shouldShowGlassmorphism,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`outline-none border-none rounded-full p-2 transition-colors duration-200 shadow-md z-10 flex items-center justify-center cursor-pointer ${
        shouldShowGlassmorphism
          ? "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800/20 dark:hover:bg-gray-400/30 dark:text-white"
          : "bg-white/10 hover:bg-white/20 text-white"
      }`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
};

export default ThemeToggle;
