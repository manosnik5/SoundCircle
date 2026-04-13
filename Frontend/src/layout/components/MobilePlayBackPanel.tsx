import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayer } from "@/contexts/MusicPlayerContext";
import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward,X } from "lucide-react";

interface MobilePlayBackPanelProps {
  onClose: () => void;
}

const MobilePlayBackPanel = ({ onClose }: MobilePlayBackPanelProps) => {
  const {
    currentSong,
    isPlaying,
    playNext,
    playPrevious,
    togglePlay,
    repeatMode,
    toggleShuffle,
    toggleRepeatMode,
    currentTime,
    duration,
    audioRef,
  } = usePlayer();



  if (!currentSong) {
    return null;
  }

  const handleSongBar = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };


  return (
    <div className="fixed inset-0 z-50 bg-[#121212] text-white p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold">Now playing</div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="text-zinc-400 hover:text-white"
          aria-label="Close player"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex h-[calc(100%-56px)] flex-col gap-6 overflow-y-auto px-2 pt-10">
        <div className="flex flex-col items-center gap-4">
          <img
            src={currentSong.imageUrl}
            alt={currentSong.title}
            className="h-76 w-76 rounded-3xl object-cover shadow-xl"
          />
          <div className="space-y-1 text-center">
            <div className="text-xl font-semibold truncate">{currentSong.title}</div>
            <div className="text-sm text-zinc-400 truncate">{currentSong.artist}</div>
          </div>
        </div>

        <div className="space-y-4 pt-10">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
              <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, "0")}</span>
              <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, "0")}</span>
            </div>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSongBar}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              className="text-zinc-400 hover:text-white"
              onClick={toggleShuffle}
              aria-label="Toggle shuffle"
            >
              <Shuffle className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-zinc-400 hover:text-white"
              onClick={playPrevious}
              disabled={!currentSong}
            >
              <SkipBack className="h-6 w-6" />
            </Button>
            <Button
              size="icon"
              className="bg-white hover:bg-white/80 text-black rounded-full h-12 w-12"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-zinc-400 hover:text-white"
              onClick={() => playNext()}
              disabled={!currentSong}
            >
              <SkipForward className="h-6 w-6" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className={`text-zinc-400 hover:text-white ${repeatMode === "one" ? "text-white" : ""}`}
              onClick={toggleRepeatMode}
              aria-label="Toggle repeat one"
            >
              <Repeat className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePlayBackPanel;
