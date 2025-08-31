
import { Bell } from "lucide-react";

const NotificationBell = ({hasNotifications,notifNumber} : {hasNotifications : boolean,notifNumber: number})  => {
  return (
    <button
      className="outline-none border-none rounded-full p-2 bg-gray-800/20 backdrop-blur-2xl hover:bg-gray-400/30 transition-colors duration-200 shadow-md z-10 flex items-center justify-center cursor-pointer text-white"
    >
      <Bell size={24}/>
      {hasNotifications && (
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
          {notifNumber}
        </span>
      )}
    </button>
  );
}

export default NotificationBell;
