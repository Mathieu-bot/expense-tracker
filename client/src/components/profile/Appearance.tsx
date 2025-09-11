import { useEffect, useState } from "react";
import { Palette, Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";

export const AppearanceTab = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { toggleTheme, isDark } = useTheme();

  const handleToggleTheme = () => {
    toggleTheme();
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDark) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, [isDark]);

  return (
    <motion.div
      initial={{ opacity: 0}}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white/25  dark:bg-gradient-to-br dark:bg-none dark:bg-transparent dark:from-primary-light/10 dark:to-primary-dark/10 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/70 dark:border-white/15 shadow-2xl transition-all duration-500"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-4 mb-8"
      >
        <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
          <Palette className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Appearance
          </h2>
          <p className="text-gray-600 dark:text-light/60 text-sm">
            Choose your preferred theme
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-purple-100/40 dark:bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/50 dark:border-white/10"
      >
        <div className="text-center mb-8">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            Theme
          </h3>
          <p className="text-gray-600 dark:text-light/60 text-sm">
            Switch between light and dark mode
          </p>
        </div>

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleTheme}
            className={`relative w-20 h-10 rounded-full p-1 transition-all duration-500 ease-in-out ${
              isDarkMode
                ? "bg-gradient-to-r from-purple-500 to-blue-500"
                : "bg-gradient-to-r from-amber-400 to-orange-400"
            } shadow-lg hover:shadow-xl`}
          >
            <motion.div
              animate={{ x: isDarkMode ? 36 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center"
            >
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-purple-600" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </motion.div>

            {isDarkMode && (
              <Sun className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
            )}
            {!isDarkMode && (
              <Moon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
            )}
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className="text-gray-500 dark:text-light/40 text-sm">
            Current theme:
            <span className="text-gray-800 dark:text-white ml-2">
              {isDarkMode ? "Dark" : "Light"}
            </span>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
