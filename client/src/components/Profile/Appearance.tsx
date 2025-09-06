import { useState } from "react";
import { Palette, Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

export const AppearanceTab = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const {toggleTheme} = useTheme();

  const handleToggleTheme = () => {
    toggleTheme();
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="bg-gradient-to-br dark:bg-transparent bg-white/10 dark:from-primary-light/10 dark:to-primary-dark/10 backdrop-blur-xl rounded-3xl p-8 border border-white/15 shadow-2xl transition-all duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
          <Palette className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Appearance</h2>
          <p className="text-light/60 text-sm">Choose your preferred theme</p>
        </div>
      </div>

      <div className="dark:bg-white/5 bg-white/4 dark:backdrop-blur-lg rounded-2xl p-8 border border-white/10">
        <div className="text-center mb-8">
          <h3 className="text-lg font-medium text-white mb-2">Theme</h3>
          <p className="text-light/60 text-sm">
            Switch between light and dark mode
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleToggleTheme}
            className={`relative w-20 h-10 rounded-full p-1 transition-all duration-500 ease-in-out ${
              isDarkMode
                ? "bg-gradient-to-r from-purple-500 to-blue-500"
                : "bg-gradient-to-r to-accent from-orange-400"
            } shadow-lg hover:shadow-xl`}
          >
            <div
              className={`absolute top-1/2 transform -translate-y-1/2 transition-all duration-500 ease-in-out ${
                isDarkMode ? "left-11" : "left-1"
              } w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center`}
            >
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-purple-600" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </div>

            {isDarkMode && (
              <Sun className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
            )}
            {!isDarkMode && (
              <Moon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
            )}
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-light/40 text-sm">
            Current theme:
            <span className="text-white ml-2">
              {isDarkMode ? "Dark" : "Light"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
