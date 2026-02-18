import { Button } from "@/components/ui/button";
import { usePlayer } from "@/contexts/MusicPlayerContext"
import { useState, useRef, useEffect } from "react";
import { Laptop2, ListMusic, Mic2, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const PlayBackControls = () => {
    const { currentSong, isPlaying, playNext, playPrevious, togglePlay} = usePlayer();
    const [volume, setVolume] = useState(75);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0)
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        audioRef.current = document.querySelector("audio")
        const audio = audioRef.current;

        if (!audio) return;

        const handleTime = () => setCurrentTime(audio.currentTime)
        const handleDuration = () => setDuration(audio.duration)
        const handleEnded = () => playNext()

        audio.addEventListener("timeupdate", handleTime)
        audio.addEventListener("loadedmetadata", handleDuration)
        audio.addEventListener("ended", handleEnded)

        return () => {
            audio.removeEventListener("timeupdate", handleTime)
            audio.removeEventListener("loadedmetadata", handleDuration)
            audio.removeEventListener("ended", handleEnded)
        }
    }, [currentSong])

    const handleSongBar = (value:number[]) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value[0]
        }
    }

  return (
    <div className="h-20 sm:h-22 bg-zinc-900 border-t border-zinc-800 px-4">
        <div className="flex justify-between items-center h-full max-w-450 mx-auto">
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
                        variant='default'
                        className='hidden sm:inline-flex hover:text-white text-zinc-400 cursor-pointer'
					>
					<Shuffle className='h-4 w-4' />
                    </Button>
                    <Button
                        size='icon'
                        variant='default'
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
                        variant='default'
                        className='hover:text-white text-zinc-400 cursor-pointer'
                        onClick={playNext}
                        disabled={!currentSong}
                    >
                        <SkipForward className='h-4 w-4' />
                    </Button>
                    <Button
                        size='icon'
                        variant='default'
                        className='hidden sm:inline-flex hover:text-white text-zinc-400 cursor-pointer'
                    >
                        <Repeat className='h-4 w-4' />
                    </Button>
                </div>
                <div className="hidden sm:flex items-center gap-2 w-full">
                    <div className='text-xs text-zinc-40'>{formatTime(currentTime)}</div>
                    	<Slider
							value={[currentTime]}
							max={duration || 100}
							step={1}
							className='w-full hover:cursor-grab active:cursor-grabbing'
							onValueChange={handleSongBar}
						/>
                    <div className="text-xs text-zinc-40">{formatTime(duration)}</div>
                </div>
            </div>
            <div className='hidden sm:flex items-center gap-4 min-w-45 w-[30%] justify-end'>
                	<Button size='icon' variant='default' className='hover:text-white text-zinc-400 cursor-pointer'>
						<Mic2 className='h-4 w-4' />
					</Button>
                    	<Button size='icon' variant='default' className='hover:text-white text-zinc-400 cursor-pointer'>
						<ListMusic className='h-4 w-4' />
					</Button>
					<Button size='icon' variant='default' className='hover:text-white text-zinc-400 cursor-pointer'>
						<Laptop2 className='h-4 w-4' />
					</Button>
                    	<div className='flex items-center gap-2'>
						<Button size='icon' variant='default' className='hover:text-white text-zinc-400 cursor-pointer'>
							<Volume1 className='h-4 w-4' />
						</Button>

						<Slider
							value={[volume]}
							max={100}
							step={1}
							className='w-24 hover:cursor-grab active:cursor-grabbing'
							onValueChange={(value) => {
								setVolume(value[0]);
								if (audioRef.current) {
									audioRef.current.volume = value[0] / 100;
								}
							}}
						/>
					</div>
            </div>
        </div>
    </div>
  )
}

export default PlayBackControls