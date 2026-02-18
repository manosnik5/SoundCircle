import { useFeaturedSongs } from "@/hooks/useMusic";
import type { Song } from "@/types";
import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";
import PlayButton from "./PlayButton";

interface FeaturedSectionProps {
    songs: Song[];
    isLoading: boolean;
}

const FeaturedSection = ({songs, isLoading}: FeaturedSectionProps) => {
    
    if (isLoading) {
        return <FeaturedGridSkeleton/>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {songs?.map((featuredSong) => (
                <div key={featuredSong._id} className="flex items-center bg-zinc-800/50 hover:bg-zinc-700/50 rounded-md overflow-hidden cursor-pointer group relative transition-colors">
                    <img src={featuredSong.imageUrl} alt={featuredSong.title} className="w-16 sm:w-20 h-16 sm:h-20 object-cover shrink-0"/>
                    <div className="flex-1 p-4">
                        <p className="font-medium truncate">{featuredSong.title}</p>
                        <p className="font-sm text-zinc-400 truncate">{featuredSong.artist}</p>     
                    </div>
                     <PlayButton song={featuredSong}/>
                </div>
              
            ))}
        </div>
    )
}

export default FeaturedSection