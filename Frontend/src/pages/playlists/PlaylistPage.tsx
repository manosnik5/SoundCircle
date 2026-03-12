import { Link } from "react-router-dom";
import { useAlbums } from "@/hooks/useMusic";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Library, Music } from "lucide-react";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import TopBar from "@/components/TopBar";

const PlaylistPage = () => {
  const { data: albums, isLoading } = useAlbums();

  return (
    <div className="h-full rounded-lg bg-zinc-900 overflow-hidden flex flex-col">
      <TopBar />
      
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br from-emerald-500 to-emerald-700 p-3 rounded-lg">
              <Library className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Your Library</h1>
              <p className="text-zinc-400 text-sm mt-1">
                {albums?.length || 0} {albums?.length === 1 ? 'album' : 'albums'}
              </p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-280px)]">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <PlaylistSkeleton key={i} />
              ))}
            </div>
          ) : albums && albums.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {albums.map((album) => (
                <Link
                  to={`/albums/${album._id}`}
                  key={album._id}
                  className="bg-zinc-800/40 p-4 rounded-lg hover:bg-zinc-800/60 transition-all group cursor-pointer"
                >
                  <div className="relative mb-4">
                    <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                      <img
                        src={album.imageUrl}
                        alt={album.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-white truncate mb-1">{album.title}</h3>
                    <p className="text-sm text-zinc-400 truncate">
                      Album • {album.artist}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">{album.releaseYear}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <Music className="w-16 h-16 text-zinc-600 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">No albums yet</h2>
              <p className="text-sm text-zinc-400">Albums will appear here once they're added</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default PlaylistPage;