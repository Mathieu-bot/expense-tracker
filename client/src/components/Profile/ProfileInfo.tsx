import { Calendar, Mail } from "lucide-react";
import { assets } from "../../assets/images";
import type { UserProfile } from "../../types/UserProfile";

const ProfileInfo = ({user}:{user:UserProfile}) => {
  return (
    <div className="relative min-w-[23vw]">
      <div className="w-36 h-36 -top-16 -left-16 absolute z-10 mx-auto rounded-full flex items-center justify-center mb-6 border-2 border-white/5 shadow-2xl">
        <div className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden">
          <img
            src={assets.userPlaceholder}
            alt="User Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -inset-4 rounded-full border border-white/5 " />
      </div>
      <div
        className="bg-gradient-to-br from-primary-light/10 to-primary-dark/10 backdrop-blur-xl rounded-2xl p-8 pt-16 border border-white/5 shadow-lg h-full 
      relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 -left-5 w-24 h-24 bg-cyan-400/5 rounded-full translate-y-12 -translate-x-12"></div>

        <div className="text-center relative z-10">
          <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            {user.firstname} {user.lastname}
          </h1>
          <p className="text-accent font-medium mb-4 inline-flex items-center gap-2 bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
            <span>@{user.username}</span>
          </p>

          <div className="space-y-3 mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-center gap-3 text-light/70 p-2 rounded-lg bg-white/5">
              <div className="w-8 h-8 rounded-full bg-cyan-400/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-sm">{user.email}</span>
            </div>

            <div className="flex items-center justify-center gap-3 text-light/70 p-2 rounded-lg bg-white/5">
              <div className="w-8 h-8 rounded-full bg-purple-400/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-sm">
                Member since {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileInfo;
