import { Home, Search, Library, MessageCircle, User, Pause, Play } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { usePendingRequests } from "@/hooks/useFriends";
import type { MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { usePlayer } from "@/contexts/MusicPlayerContext";

interface BottomBarMenuProps {
  onOpen: () => void;
}

const BottomBarMenu = ({ onOpen }: BottomBarMenuProps) => {
  const location = useLocation();
  const { data: pendingRequests } = usePendingRequests();
  const requestCount = pendingRequests?.length || 0;

  const { currentSong, isPlaying, togglePlay } = usePlayer();

  const handleTogglePlay = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    togglePlay();
  };

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/search", icon: Search, label: "Search" },
    { path: "/playlist", icon: Library, label: "Playlists" },
    { path: "/chat", icon: MessageCircle, label: "Chat" },
    { path: "/friends", icon: User, label: "Friends" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 z-50">
      
      {currentSong && (
        <div className="p-2">
          <button
            type="button"
            onClick={onOpen}
            className="flex items-center justify-between gap-3 px-4 py-3 bg-linear-to-b from-[#5038a0]/80 to-zinc-900/10 rounded-lg w-full"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className="h-12 w-12 rounded-md object-cover"
              />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">
                  {currentSong.title}
                </div>
                <div className="truncate text-xs text-zinc-400">
                  {currentSong.artist}
                </div>
              </div>
            </div>

            <Button
              size="icon"
              variant="ghost"
              onClick={handleTogglePlay}
              className="text-zinc-400 hover:text-white"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
          </button>
        </div>
      )}

      {/* 📱 Bottom Navigation */}
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 flex-1 relative ${
                isActive ? "text-[#694bcc]" : "text-zinc-400"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>

              {item.path === "/friends" && requestCount > 0 && (
                <span className="absolute top-1 right-[25%] bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {requestCount > 9 ? "9+" : requestCount}
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