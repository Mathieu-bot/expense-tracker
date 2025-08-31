import { Moon, Sun } from "lucide-react";
import { useState } from "react";

function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  return (
    <button
      onClick={() => setIsDarkMode((e: boolean) => !e)}
      className="outline-none border-none rounded-full p-2 bg-gray-800/20 backdrop-blur-2xl hover:bg-gray-400/30 transition-colors duration-200 shadow-md z-10 flex items-center justify-center cursor-pointer text-white"
    >
      {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
}

export default ThemeToggle;
