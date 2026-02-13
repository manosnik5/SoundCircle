import { useParams } from "react-router-dom"
import { useAlbum } from "@/hooks/useMusic";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Clock, Play } from "lucide-react";

export const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
  const {albumId} = useParams();
  const { data: album, isLoading: albumLoading } = useAlbum(albumId || "");
  
  if (!albumId) {
    return <div>Album not found</div>;
  }
 
  if (albumLoading) {
    return <div>Loading...</div>;
  }
 
  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        <div className="relative min-h-full">
          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              <img src={album?.imageUrl} alt={album?.title} className="w-60 h-60 rounded shadow-xl"/>
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Album</p>
                <h1 className="text-7xl font-bold my-4">{album?.title}</h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">{album?.artist} •</span>
                  <span className="font-medium text-white">{album?.songs.length} songs •</span>
                  <span className="font-medium text-white">{album?.releaseYear}</span>
                </div>
              </div>
            </div>
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button size='icon' className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-400 cursor-pointer hover:scale-105 transition-all">
                <Play className="text-black h-7 w-7"></Play>
              </Button>
            </div>

            <div className="bg-black/20 backdrop-blur-sm">
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  <Clock className="h-4 w-4"/>
                </div>
              </div>
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {album?.songs.map((song, index) => (
                    <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 rounded-md group border-b border-white/5 cursor-pointer hover:bg-white/5" key={song._id}>
                      <div className="flex items-center justify-center">
                        <span className="group-hover:hidden">{index + 1}</span>
                        <Play className="hidden h-4 w-4 group-hover:block"/>
                      </div>
                      <div className="flex items-center gap-3">
                        <img src={song.imageUrl} alt={song.title} className="size-10"/>
                        <div>
                          <div className={`font-medium text-white`}>{song.title}</div>
                          <div>{song.artist}</div>
											  </div>
                      </div>
                    <div className='flex items-center'>{song.createdAt.split("T")[0]}</div>
                    <div className='flex items-center'>{formatDuration(song.duration)}</div>
                    </div>
                  ))}
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