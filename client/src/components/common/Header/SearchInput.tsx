import { useState } from "react";
import { Search } from "lucide-react";

const SearchInput = ({ placeholder }: { placeholder: string }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`relative transition-all duration-300 ${
        isFocused ? "w-64" : "w-56"
      }`}
    >
      <Search
        className="absolute z-[50] left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-white/50"
        size={20}
      />
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-2 border rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors duration-300 ${"border-gray-600 text-gray-800 dark:bg-transparent placeholder:text-gray-700 focus:ring-primary/30 dark:border-white/20 dark:text-white dark:placeholder-white/70 dark:focus:ring-white/30"}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};

export default SearchInput;
