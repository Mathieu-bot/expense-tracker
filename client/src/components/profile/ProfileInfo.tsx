import { Calendar, Mail, User, Lock, Palette } from "lucide-react";
import { assets } from "../../assets/images";
import type { UserProfile } from "../../types/UserProfile";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

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

export const ProfileInfo = ({ user, activeTab, onTabChange }: ProfileInfoProps) => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div
        className="bg-white/80 dark:bg-none dark:bg-gradient-to-br dark:bg-transparent dark:from-primary-light/10 dark:to-primary-dark/10 backdrop-blur-xl
                      rounded-3xl py-5 border border-gray-200/70 dark:border-white/15 shadow-2xl h-full 
                      relative overflow-hidden group flex"
      >
        {/* left content*/}
        <div className="flex-1 relative z-10">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-16 translate-x-16 bg-cyan-400/10 dark:bg-cyan-400/5"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 dark:bg-accent/5 rounded-full translate-y-12 -translate-x-12"></div>

          {/*profile*/}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative mb-2 group"
            >
              <div className="relative w-32 h-32">
                <img
                  src={assets.userPlaceholder}
                  alt="User Profile"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-2xl font-bold mb-2 text-gray-800 dark:text-white"
            >
              {user.firstname} {user.lastname}
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="dark:bg-gradient-to-r bg-cyan-100 dark:bg-transparent dark:from-purple-500/15 dark:to-blue-500/15 px-4 py-2 rounded-full border border-cyan-200/50 dark:border-purple-500/30"
            >
              <span className="text-cyan-700 dark:text-white font-semibold text-sm">
                @{user.username}
              </span>
            </motion.div>
          </div>

          {/* email  & member info*/}
          <div className="px-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="py-4 border-b border-gray-400/20 dark:border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-400/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-cyan-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-light/70 mb-1">
                    Email
                  </h3>
                  <p className="text-gray-800 dark:text-white text-sm truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="py-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/10 dark:bg-purple-400/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-light/70 mb-1">
                    Member since
                  </h3>
                  <p className="text-gray-800 dark:text-white text-sm">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* right */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="absolute overflow-hidden z-[100] rounded-l-lg -right-1 top-1/2 -translate-y-1/2 border border-gray-400/20 dark:border-white/5 flex flex-col items-center justify-center ml-6 my-auto"
        >
          {/*indicator */}
          <div
            className="absolute z-[200] right-[3px] w-1 bg-gradient-to-b from-cyan-500 to-blue-500 dark:from-purple-500 dark:to-blue-500 rounded-full transition-all duration-500 ease-in-out"
            style={{
              top: `${indicatorStyle.top}px`,
              height: `${indicatorStyle.height}px`,
            }}
          />

          {tabs.map(({ id, icon: Icon, label }, index) => (
            <motion.button
              key={id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              onClick={() => onTabChange(id)}
              className={`px-3 py-4 transition-all duration-300 group relative border-none flex items-center justify-center
    ${
      activeTab === id
        ? "bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-purple-500/15 dark:to-blue-500/15 text-cyan-700 dark:text-white shadow-inner"
        : "text-gray-600 dark:text-light/60 hover:bg-cyan-50/50 dark:hover:bg-white/10 hover:text-cyan-700 dark:hover:text-white"
    }`}
            >
              <Icon className="w-5 h-5" />
              <span
                className="absolute left-full ml-3 px-2 py-1 text-xs text-white 
               bg-gray-800 dark:bg-black/70 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap"
              >
                {label}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

