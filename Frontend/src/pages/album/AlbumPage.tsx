import { useParams } from "react-router-dom"
import { useAlbum } from "@/hooks/useMusic";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Clock, Pause, Play } from "lucide-react";
import { usePlayer } from "@/contexts/MusicPlayerContext";

export const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
  const {albumId} = useParams();
  const { data: album, isLoading: albumLoading } = useAlbum(albumId || "");
  const { currentSong, isPlaying, playAlbum, togglePlay} = usePlayer();

  const handlePlayAlbum = () => {
    if (!album) return
    const currentAlbumPlaying = album?.songs.some(song => song._id === currentSong?._id)
    if(currentAlbumPlaying) togglePlay();
    else {
      playAlbum(album?.songs, 0)
    }
  }
  
  const handlePlayAlbumSong = (index: number) => {
    if (!album) return
    playAlbum(album?.songs, index)
  }
  
  if (!albumId) {
    return <div>Album not found</div>;
  }
 
  if (albumLoading) {
    return <div className="flex items-center justify-center h-full">
      <div className="text-zinc-400">Loading...</div>
    </div>;
  }
 
  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        <div className="relative min-h-full">
          <div
            className='absolute inset-0 bg-linear-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none'
            aria-hidden='true'
          />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row p-4 sm:p-6 gap-4 sm:gap-6 pb-6 sm:pb-8">
              <img 
                src={album?.imageUrl} 
                alt={album?.title} 
                className="w-48 h-48 sm:w-60 sm:h-60 rounded shadow-xl mx-auto sm:mx-0"
              />
              <div className="flex flex-col justify-end text-center sm:text-left">
                <p className="text-sm font-medium">Album</p>
                <h1 className="text-4xl sm:text-7xl font-bold my-2 sm:my-4">{album?.title}</h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">{album?.artist}</span>
                  <span>•</span>
                  <span className="font-medium text-white">{album?.songs.length} songs</span>
                  <span>•</span>
                  <span className="font-medium text-white">{album?.releaseYear}</span>
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 pb-4 flex items-center justify-center sm:justify-start gap-6">
              <Button 
                size='icon' 
                className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 cursor-pointer hover:scale-105 transition-all" 
                onClick={handlePlayAlbum}
              >
                {isPlaying && album?.songs.some(song => song._id === currentSong?._id) ? (
                  <Pause className="text-black h-7 w-7"/>
                ) : (
                  <Play className="text-black h-7 w-7 ml-1"/>
                )}
              </Button>
            </div>

            <div className="bg-black/20 backdrop-blur-sm">
              <div className="hidden md:grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  <Clock className="h-4 w-4"/>
                </div>
              </div>

              <div className="px-2 sm:px-6">
                <div className="space-y-2 py-4">
                  {album?.songs.map((song, index) => { 
                    const isCurrentSong = currentSong?._id === song._id
                    return (
                      <div 
                        key={song._id}
                        onClick={() => handlePlayAlbumSong(index)}
                        className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[16px_4fr_2fr_1fr] gap-3 md:gap-4 px-2 sm:px-4 py-2 text-sm text-zinc-400 rounded-md group hover:bg-white/5 cursor-pointer"
                      >
                        <div className="flex items-center justify-center w-8">
                          {isCurrentSong && isPlaying ? (
                            <div className="text-emerald-500 text-lg">♫</div>
                          ) : (
                            <>
                              <span className="group-hover:hidden text-zinc-400">{index + 1}</span>
                              <Play className='h-4 w-4 hidden group-hover:block text-white' />
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-3 min-w-0">
                          <img 
                            src={song.imageUrl} 
                            alt={song.title} 
                            className="w-10 h-10 rounded"
                          />
                          <div className="min-w-0 flex-1">
                            <div className={`font-medium text-white truncate ${isCurrentSong ? 'text-emerald-500' : ''}`}>
                              {song.title}
                            </div>
                            <div className="truncate text-xs sm:text-sm">{song.artist}</div>
                          </div>
                        </div>

                        <div className='hidden md:flex items-center'>
                          {song.createdAt.split("T")[0]}
                        </div>

                        <div className='flex items-center justify-end md:justify-start'>
                          {formatDuration(song.duration)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export default AlbumPage