import { ScrollArea } from "@/components/ui/scroll-area";
import TopBar from "../../components/TopBar"
import FeaturedSection from "./components/FeaturedSection";
import SectionGrid from "./components/SectionGrid";
import { useMadeForYouSongs, useTrendingSongs, useFeaturedSongs } from "@/hooks/useMusic";
import { usePlayer } from '@/contexts/MusicPlayerContext';
import { useEffect } from "react";


const HomePage = () => {
   const { data: featuredSongs, isLoading: featuredLoading} = useFeaturedSongs();
   const { data: madeForYouSongs, isLoading: madeForYouLoading} = useMadeForYouSongs();
   const { data: trendingSongs, isLoading: trendingLoading} = useTrendingSongs();
   const { initializeQueue } = usePlayer();

   useEffect(() => {
    if (featuredSongs && madeForYouSongs && trendingSongs && featuredSongs.length > 0 && madeForYouSongs.length > 0 && trendingSongs.length > 0) {
      const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs]
      initializeQueue(allSongs)
    }

   }, [initializeQueue, featuredSongs, madeForYouSongs, trendingSongs])


  return (
    <main className="rounded-md overflow-hidden h-full bg-linear-to-b from bg-zinc-800 to-zinc-900">
        <TopBar/>
        <section>
       
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Featured Songs</h1>
            <FeaturedSection songs={featuredSongs} isLoading={featuredLoading}/>
          

          <div className="space-y-8">
            <SectionGrid title="Made For You" songs={madeForYouSongs} isLoading={madeForYouLoading}/>
            <SectionGrid title="Trending" songs={trendingSongs} isLoading={trendingLoading}/>
          </div>
          </div>
          
        </ScrollArea>

      </section>

    
    </main>
  )
}

export default HomePage