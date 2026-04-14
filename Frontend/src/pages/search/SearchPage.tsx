import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchAlbums, useSearchSongs } from "@/hooks/useMusic";
import { Disc, Music, Search } from "lucide-react"
import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import PlayButton from "../home/components/PlayButton";

const SearchPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { data: searchSongs, isLoading: isLoadingSongs } = useSearchSongs(debouncedQuery);
  const { data: searchAlbums, isLoading: isLoadingAlbums } = useSearchAlbums(debouncedQuery);

  const hasResults = (searchSongs && searchSongs.length > 0) || (searchAlbums && searchAlbums.length > 0);
  const isLoading = isLoadingSongs || isLoadingAlbums;

  useEffect(() => {
    const checkIfMobile = () => {
      if (window.innerWidth >= 768) {
        navigate('/');
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleAlbumClick = (albumId: string) => {
    navigate(`/albums/${albumId}`);
    setInputValue('');
  };

  return (
    <div className='h-full bg-zinc-900 flex flex-col'>
      <div className='p-4 bg-zinc-800/50 border-b border-zinc-800'>
        <div className='relative' ref={searchRef}>
          <div className="flex items-center">
            <div className="flex items-center justify-center h-10 w-10 border border-r-0 border-zinc-700 bg-zinc-800 rounded-l-lg">
              <Search className="w-4 h-4 text-zinc-400" />
            </div>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="What do you want to listen to?"
              autoFocus
              className="text-white h-10 px-3 bg-zinc-800 border border-zinc-700 rounded-r-lg outline-none text-sm flex-1"
            />
          </div>
        </div>
      </div>

      <ScrollArea className='flex-1'>
        <div className='p-4'>
          {!inputValue ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
              <Search className="w-16 h-16 text-zinc-600 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Search for songs and albums</h2>
              <p className="text-sm text-zinc-400">Find your favorite music</p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-zinc-400">Searching...</div>
            </div>
          ) : hasResults ? (
            <div className="space-y-6">
              {searchAlbums && searchAlbums.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <Disc className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-lg font-semibold text-white">Albums</h3>
                  </div>
                  <div className="space-y-2">
                    {searchAlbums.map((album) => (
                      <button
                        key={album._id}
                        onClick={() => handleAlbumClick(album._id)}
                        className="w-full p-3 hover:bg-zinc-800 rounded-lg flex items-center gap-3 text-left transition-colors"
                      >
                        <img
                          src={album.imageUrl}
                          alt={album.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{album.title}</p>
                          <p className="text-zinc-400 text-sm truncate">
                            {album.artist} • {album.releaseYear}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchSongs && searchSongs.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <Music className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-lg font-semibold text-white">Songs</h3>
                  </div>
                  <div className="space-y-2">
                    {searchSongs.map((song) => (
                      <div
                        key={song._id}
                        className="w-full p-3 hover:bg-zinc-800 rounded-lg flex items-center gap-3 group relative"
                      >
                        <img
                          src={song.imageUrl}
                          alt={song.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{song.title}</p>
                          <p className="text-zinc-400 text-sm truncate">{song.artist}</p>
                        </div>                     
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
              <Search className="w-16 h-16 text-zinc-600 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">No results found</h2>
              <p className="text-sm text-zinc-400">Try searching for something else</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SearchPage;