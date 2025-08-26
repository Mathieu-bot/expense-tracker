import { useState } from "react";
import { Search } from "lucide-react";

const SearchInput = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`relative transition-all duration-300 ${
        isFocused ? "w-72" : "w-56"
      }`}
    >
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"
        size={20}
      />
      <input
        type="text"
        placeholder="Search transactions..."
        className="w-full pl-10 pr-4 py-3  border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 transition-colors duration-300"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};

export default SearchInput;
