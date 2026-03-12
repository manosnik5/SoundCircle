import { Button } from "@/components/ui/button";
import { usePlayer } from "@/contexts/MusicPlayerContext"
import { useState } from "react";
import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2, VolumeX} from "lucide-react";
import { Slider } from "@/components/ui/slider";

const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const PlayBackControls = () => {
    const { 
        currentSong, 
        isPlaying, 
        playNext, 
        playPrevious, 
        togglePlay,
        volume,
        setVolume,
        isMuted,
        setIsMuted,
        currentTime,
        duration,
        audioRef
    } = usePlayer();
    
    const [previousVolume, setPreviousVolume] = useState(75);

    const handleSongBar = (value: number[]) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value[0];
        }
    };

    const handleVolume = (value: number[]) => {
        const newVolume = value[0];
        setVolume(newVolume);
        
        if (newVolume === 0) {
            setIsMuted(true);
        } else {
            setIsMuted(false);
        }
    };

    const toggleMute = () => {
        if (isMuted) {   
            const volumeToRestore = previousVolume > 0 ? previousVolume : 75;
            setVolume(volumeToRestore);
            setIsMuted(false);
        } else {  
            setPreviousVolume(volume);
            setVolume(0);
            setIsMuted(true);
        }
    };

  return (
    <div className="h-20 sm:h-22 bg-[#121212] px-4 border-t border-zinc-800">
        <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
            <div className="hidden sm:flex items-center gap-4 min-w-45 w-[30%]">
                {currentSong && (
                    <>
                        <img
                            src={currentSong.imageUrl}
                            alt={currentSong.title}
                            className='w-14 h-14 object-cover rounded-md'
                        />
                        <div className='flex-1 min-w-0'>
                            <div className='font-medium truncate hover:underline cursor-pointer'>{currentSong.title}</div>
                            <div className='text-sm text-zinc-400 truncate hover:underline cursor-pointer'>{currentSong.artist}</div>
                        </div>
                    </>
                )}
            </div>
            <div className='flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]'>
                <div className='flex items-center gap-4 sm:gap-6'>
                    <Button
                        size='icon'
                        variant='ghost'
                        className='hidden sm:inline-flex hover:text-white text-zinc-400 cursor-pointer'
                    >
                        <Shuffle className='h-4 w-4' />
                    </Button>
                    <Button
                        size='icon'
                        variant='ghost'
                        className='hover:text-white text-zinc-400 cursor-pointer'
                        onClick={playPrevious}
                        disabled={!currentSong}
                    >
                        <SkipBack className='h-4 w-4' />
                    </Button>

                    <Button
                        size='icon'
                        className='bg-white hover:bg-white/80 text-black rounded-full h-8 w-8 cursor-pointer'
                        onClick={togglePlay}
                        disabled={!currentSong}
                    >
                        {isPlaying ? <Pause className='h-5 w-5' /> : <Play className='h-5 w-5' />}
                    </Button>
                    <Button
                        size='icon'
                        variant='ghost'
                        className='hover:text-white text-zinc-400 cursor-pointer'
                        onClick={playNext}
                        disabled={!currentSong}
                    >
                        <SkipForward className='h-4 w-4' />
                    </Button>
                    <Button
                        size='icon'
                        variant='ghost'
                        className='hidden sm:inline-flex hover:text-white text-zinc-400 cursor-pointer'
                    >
                        <Repeat className='h-4 w-4' />
                    </Button>
                </div>
                <div className="hidden sm:flex items-center gap-2 w-full">
                    <div className='text-xs text-zinc-400'>{formatTime(currentTime)}</div>
                    <Slider
                        value={[currentTime]}
                        max={duration || 100}
                        step={1}
                        className='w-full hover:cursor-grab active:cursor-grabbing'
                        onValueChange={handleSongBar}
                    />
                    <div className="text-xs text-zinc-400">{formatTime(duration)}</div>
                </div>
            </div>
            <div className='hidden sm:flex items-center gap-4 min-w-45 w-[30%] justify-end'>
                <Button 
                    size='icon' 
                    variant='ghost' 
                    className='hover:text-white text-zinc-400 cursor-pointer'
                    onClick={toggleMute}
                >
                    {isMuted || volume === 0 ? (
                        <VolumeX className='h-4 w-4' />
                    ) : (
                        <Volume2 className='h-4 w-4' />
                    )}
                </Button>
                <Slider
                    value={[volume]}
                    max={100}
                    step={1}
                    className='w-64 hover:cursor-grab active:cursor-grabbing'
                    onValueChange={handleVolume}
                />
            </div>
        </div>
    </div>
  )
}

export default PlayBackControls