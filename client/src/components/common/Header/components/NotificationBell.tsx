import { Bell } from "lucide-react";

const NotificationBell = ({
  hasNotifications,
  notifNumber,
  shouldShowGlassmorphism
}: {
  hasNotifications: boolean;
  notifNumber: number;
  shouldShowGlassmorphism: boolean;
}) => {
  return (
    <button
      className={`outline-none relative border-none rounded-full p-2 transition-colors duration-200 shadow-md z-10 flex items-center justify-center cursor-pointer ${
        shouldShowGlassmorphism
          ? "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800/20 dark:hover:bg-gray-400/30 dark:text-white"
          : "bg-white/10 hover:bg-white/20 text-white"
      }`}
    >
      <Bell size={24}/>
      {hasNotifications && (
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
          {notifNumber}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;