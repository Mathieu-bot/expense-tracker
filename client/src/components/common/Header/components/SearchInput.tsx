import { useState } from "react";
import { Search } from "lucide-react";

const SearchInput = ({
  placeholder,
  shouldShowGlassmorphism,
}: {
  placeholder: string;
  shouldShowGlassmorphism: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`relative transition-all duration-300 ${
        isFocused ? "w-64" : "w-56"
      }`}
    >
      <Search
        className={`absolute z-[50] left-3 top-1/2 transform -translate-y-1/2 ${
          shouldShowGlassmorphism
            ? "text-gray-600 dark:text-white/50"
            : "text-white/70"
        }`}
        size={20}
      />
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-3 border rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors duration-300 ${
          shouldShowGlassmorphism
            ? "border-gray-600 text-gray-800 placeholder:text-gray-700 focus:ring-primary/30 dark:border-white/20 dark:text-white dark:placeholder-white/70 dark:focus:ring-white/30"
            : "border-white/30 text-white placeholder-white/70 focus:ring-white/30 bg-white/10 backdrop-blur-sm"
        }`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};

export default SearchInput;
