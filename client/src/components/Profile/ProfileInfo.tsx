import { Calendar, Mail, User, Lock, Palette } from "lucide-react";
import { assets } from "../../assets/images";
import type { UserProfile } from "../../types/UserProfile";
import { useEffect, useRef, useState } from "react";

interface ProfileInfoProps {
  user: UserProfile;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "profile", icon: User, label: "Profile" },
  { id: "security", icon: Lock, label: "Security" },
  { id: "appearance", icon: Palette, label: "Appearance" },
];

const ProfileInfo = ({ user, activeTab, onTabChange }: ProfileInfoProps) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (activeIndex >= 0 && tabRefs.current[activeIndex]) {
      const activeTabElement = tabRefs.current[activeIndex];
      if (activeTabElement) {
        setIndicatorStyle({
          top: activeTabElement.offsetTop,
          height: activeTabElement.offsetHeight,
        });
      }
    }
  }, [activeTab]);

  return (
    <div className="relative">
      <div
        className="bg-gradient-to-br from-primary-light/10 to-primary-dark/10 backdrop-blur-xl
                      rounded-3xl py-5 border border-white/15 shadow-2xl h-full 
                      relative overflow-hidden group flex"
      >
        {/* left content*/}
        <div className="flex-1 relative z-10">
          <div className="absolute top-0 -right-2 w-32 h-32 bg-accent/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 -left-4 w-24 h-24 bg-cyan-400/5 rounded-full translate-y-12 -translate-x-12"></div>
          {/*profile*/}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-2 group">
              <div className="relative w-32 h-32 rounded-2xl ">
                <img
                  src={assets.userPlaceholder}
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-2 text-white">
              {user.firstname} {user.lastname}
            </h1>
            <div className="bg-gradient-to-r from-purple-500/15 to-blue-500/15 px-4 py-2 rounded-full border border-purple-500/30">
              <span className="text-white font-semibold text-sm">
                @{user.username}
              </span>
            </div>
          </div>

          {/* email  & member info*/}
          <div className="px-10">
            <div className="  py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg  bg-blue-400/10 flex items-center justify-center ">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-light/70 mb-1">
                    Email
                  </h3>
                  <p className="text-white text-sm truncate">{user.email}</p>
                </div>
              </div>
            </div>

            <div className=" py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-400/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-light/70 mb-1">
                    Member since
                  </h3>
                  <p className="text-white text-sm">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* right */}
        <div className="absolute overflow-hidden z-[100] rounded-l-lg -right-1 top-1/2 -translate-y-1/2 border border-white/5 flex flex-col items-center justify-center  ml-6 my-auto">
          {/*indicator */}
          <div
            className="absolute right-[3px] w-1 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full transition-all duration-500 ease-in-out"
            style={{
              top: `${indicatorStyle.top}px`,
              height: `${indicatorStyle.height}px`,
            }}
          />

          {tabs.map(({ id, icon: Icon, label }, index) => (
            <button
              key={id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              onClick={() => onTabChange(id)}
              className={`px-3 py-4 transition-all duration-300 group relative border-none flex items-center justify-center
    ${
      activeTab === id
        ? "bg-gradient-to-r from-purple-500/15 to-blue-500/15 text-white shadow-inner"
        : "text-light/60 hover:bg-white/10 hover:text-white"
    }`}
            >
              <Icon className="w-5 h-5" />
              <span
                className="absolute left-full ml-3 px-2 py-1 text-xs text-white 
               bg-black/70 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap"
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
