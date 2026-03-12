import { Home, Search, Library, MessageCircle, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { usePendingRequests } from "@/hooks/useFriends";

const BottomBarMenu = () => {
  const location = useLocation();
  const { data: pendingRequests } = usePendingRequests();
  const requestCount = pendingRequests?.length || 0;

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/search", icon: Search, label: "Search" },
    { path: "/playlist", icon: Library, label: "Library" },
    { path: "/chat", icon: MessageCircle, label: "Chat" },
    { path: "/friends", icon: User, label: "Friends" },
  ];

  return (
    <div className="h-16 bg-zinc-900 border-t border-zinc-800">
      <div className="flex justify-around items-center h-full px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full relative ${
                isActive ? "text-emerald-500" : "text-zinc-400"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
        
              {item.path === "/friends" && requestCount > 0 && (
                <span className="absolute top-2 right-[25%] bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {requestCount > 9 ? '9+' : requestCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomBarMenu;