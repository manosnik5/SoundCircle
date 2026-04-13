import type { MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { usePlayer } from "@/contexts/MusicPlayerContext";
import { Pause, Play } from "lucide-react";

interface MobileMiniPlayerProps {
  onOpen: () => void;
}

const MobileMiniPlayer = ({ onOpen }: MobileMiniPlayerProps) => {
  const { currentSong, isPlaying, togglePlay } = usePlayer();

  if (!currentSong) {
    return null;
  }

  const handleTogglePlay = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    togglePlay();
  };

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex items-center justify-between gap-3 px-4 py-3 bg-linear-to-b from-[#5038a0]/80 to-zinc-900/10 text-left  rounded-lg w-[95%]"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <img
          src={currentSong.imageUrl}
          alt={currentSong.title}
          className="h-12 w-12 rounded-md object-cover"
        />
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{currentSong.title}</div>
          <div className="truncate text-xs text-zinc-400">{currentSong.artist}</div>
        </div>
      </div>
      <Button
        size="icon"
        variant="ghost"
        onClick={handleTogglePlay}
        className="text-zinc-400 hover:text-white"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </Button>
    </button>
  );
};

export default MobileMiniPlayer;
