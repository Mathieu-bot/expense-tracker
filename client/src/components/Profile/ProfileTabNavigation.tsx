import React, { useEffect, useMemo, useRef, useState } from "react";
import { User, Lock, Palette } from "lucide-react";

interface ProfileTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ProfileTabNavigation: React.FC<ProfileTabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
 const tabs = useMemo(
  () => [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "appearance", label: "Appearance", icon: Palette },
  ],
  []
);

  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (activeIndex >= 0 && tabRefs.current[activeIndex]) {
      const activeTabElement = tabRefs.current[activeIndex];
      if (activeTabElement) {
        setIndicatorStyle({
          width: activeTabElement.offsetWidth,
          left: activeTabElement.offsetLeft,
        });
      }
    }
  }, [activeTab,tabs]);

  return (
    <div className="relative mb-8 bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/10">
      <div className="flex relative">
        <div
          className="absolute bottom-0 h-0.5 transition-all duration-300 ease-out"
          style={{
            width: `${indicatorStyle.width}px`,
            left: `${indicatorStyle.left}px`,
          }}
        >
          <div className="w-full h-full rounded-full bg-accent" />
        </div>

        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex-1 py-3 px-4 rounded-lg flex items-center border-none justify-center gap-2 transition-colors duration-300 ${
                isActive ? "text-accent" : "text-light/60 hover:text-light/90"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
