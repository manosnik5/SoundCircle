import { SignedOut, UserButton } from '@clerk/clerk-react';
import { Disc, LayoutDashboardIcon, Music, Search } from 'lucide-react';
import SignInOAuthButton from './SignInOAuthButton';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminCheck } from '@/hooks/useMusic';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';
import { useState, useEffect, useRef } from "react"
import { useSearchSongs, useSearchAlbums } from '@/hooks/useMusic';
import { ScrollArea } from './ui/scroll-area';
import PlayButton from '@/pages/home/components/PlayButton';

const TopBar = () => {
  const { data: isAdmin, isLoading } = useAdminCheck();
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: searchSongs } = useSearchSongs(debouncedQuery);
  const { data: searchAlbums } = useSearchAlbums(debouncedQuery);

  const hasResults = (searchSongs && searchSongs.length > 0) || (searchAlbums && searchAlbums.length > 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    setShowResults(inputValue.length > 0);
  }, [inputValue]);


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAlbumClick = (albumId: string) => {
    navigate(`/albums/${albumId}`);
    setShowResults(false);
    setInputValue('');
  };

  if (isLoading) return <div>Not admin</div>;

  return (
    <div className='flex items-center justify-between p-4 sticky top-0 bg-[#121212] backdrop-blur-md z-10 gap-2'>
      
      <div className='flex gap-2 items-center shrink-0'>
        logo
      </div>

      <div className='flex-1 flex justify-center px-2 min-w-0'>
        <div className='relative w-full max-w-sm' ref={searchRef}>
          <div className="flex items-center w-full">
            <button
              className="flex items-center justify-center h-9 w-10 border border-r-0 border-[#a5a4a43a] bg-[#27292d] rounded-l-[24px] cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
            </button>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => inputValue.length > 0 && setShowResults(true)}
              placeholder="Search..."
              className="text-[#E0E0E0] h-9 px-3 bg-[#27292d] border border-[#a5a4a43a] rounded-r-[24px] outline-none text-sm w-full min-w-0"
            />
          </div>

        
          {showResults && (
            <div className='absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#a5a4a43a] rounded-lg shadow-lg z-50 overflow-hidden'>
              <ScrollArea className=' w-full bg-[#1a1a1a] border border-[#a5a4a43a] rounded-lg shadow-lg max-w-125 z-50 h-90'>
                {hasResults ? (
                  <div className="py-2">
                    {searchAlbums && searchAlbums.length > 0 && (
                      <div className="mb-2">
                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase flex items-center gap-2">
                          <Disc className="w-3 h-3" />
                          Albums
                        </div>
                        {searchAlbums.map((album) => (
                          <button
                            key={album._id}
                            onClick={() => handleAlbumClick(album._id)}
                            className="w-full px-4 py-3 hover:bg-[#27292d] flex items-center gap-3 text-left transition-colors cursor-pointer"
                          >
                            <img
                              src={album.imageUrl}
                              alt={album.title}
                              className="w-9 h-9 rounded object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate text-sm">{album.title}</p>
                              <p className="text-gray-400 text-xs truncate">
                                {album.artist} • {album.releaseYear}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {searchSongs && searchSongs.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase flex items-center gap-2">
                          <Music className="w-3 h-3" />
                          Songs
                        </div>
                        {searchSongs.map((song) => (
                          <button
                            key={song._id}
                            className="w-full px-4 py-3 hover:bg-[#27292d] flex items-center gap-3 text-left transition-colors cursor-pointer relative group"
                          >
                            <img
                              src={song.imageUrl}
                              alt={song.title}
                              className="w-9 h-9 rounded object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate text-sm">{song.title}</p>
                              <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                            </div>
                            <PlayButton song={song} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : debouncedQuery ? (
                  <div className="p-4 text-center text-gray-400 text-sm">
                    No results found for "{debouncedQuery}"
                  </div>
                ) : null}
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      {/* Right side — fixed width, won't be pushed off screen */}
      <div className='flex gap-2 items-center shrink-0'>
        {isAdmin ? (
          <div className='flex items-center gap-2'>
            <Link
              to="/admin"
              className={cn(buttonVariants({ variant: "default" }), "hidden sm:flex text-sm px-3 py-1.5")}
            >
              <LayoutDashboardIcon className='size-4 mr-1.5' />
              <span>Admin</span>
            </Link>
            {/* Icon-only on mobile */}
            <Link
              to="/admin"
              className={cn(buttonVariants({ variant: "default", size: "icon" }), "sm:hidden")}
            >
              <LayoutDashboardIcon className='size-4' />
            </Link>
            <UserButton />
          </div>
        ) : (
          <div className='flex items-center gap-2'>
            <SignedOut>
              <SignInOAuthButton />
            </SignedOut>
            <UserButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;