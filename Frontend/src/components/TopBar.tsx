import { SignedOut, UserButton } from '@clerk/clerk-react';
import { Disc, LayoutDashboardIcon, Music, Search } from 'lucide-react';
import SignInOAuthButton from './SignInOAuthButton';
import { Link, useSearchParams, useNavigate  } from 'react-router-dom';
import { useAdminCheck } from '@/hooks/useMusic';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';
import { useState, useEffect} from "react"
import { useSearchSongs, useSearchAlbums } from '@/hooks/useMusic';
import { ScrollArea } from './ui/scroll-area';
import PlayButton from '@/pages/home/components/PlayButton';

const TopBar = () => {
  const { data: isAdmin, isLoading } = useAdminCheck();
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  

  const { data: searchSongs, isLoading: isSearchingSongs } = useSearchSongs(debouncedQuery);
  const { data: searchAlbums, isLoading: isSearchingAlbums } = useSearchAlbums(debouncedQuery);

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

  const handleAlbumClick = (albumId: string) => {
    navigate(`/albums/${albumId}`);
  };



  if (isLoading) return <div>Not admin</div>;
  
  return (
    <div className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10'>
        <div className='flex gap-2 items-center'>
            {/* <img src="" alt="logo image" className='size-8'/> */}
            logo
        </div>
        <div className='flex flex-col relative ml-8'>
             <div className="flex items-center justify-center w-full max-w-125 ">
            <button
                className="flex items-center justify-center h-9 w-10 sm:w-15 border border-r-0 border-[#a5a4a43a] bg-[#27292d]  rounded-l-[24px] cursor-pointer"
            >
                <Search className="w-5.5 h-5.5" />
            </button>
            <input
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type to search..."
                className="text-[#E0E0E0] h-9 px-4 bg-[#27292d] border border-[#a5a4a43a] rounded-r-[24px] outline-none text-sm "
            />
           
            </div>
              {showResults && ( 
                <ScrollArea className='absolute top-0 left-0 w-full bg-[#1a1a1a] border border-[#a5a4a43a] rounded-lg shadow-lg max-w-125 z-50 h-90'>
                {hasResults ? (
                    <div className="py-2">
                        {searchSongs && searchSongs.length > 0 && (
                    <div>
                      {searchAlbums && searchAlbums.length > 0 && (
                    <div className="mb-2">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase flex items-center gap-2">
                        <Disc className="w-4 h-4" />
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
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{album.title}</p>
                            <p className="text-gray-400 text-sm truncate">
                              {album.artist} • {album.releaseYear}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                      <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase flex items-center gap-2">
                        <Music className="w-4 h-4" />
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
                            className="w-10 h-10 rounded object-cover"
                          />
          
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{song.title}</p>
                            <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                          </div>
                          <PlayButton song={song}/>
                        </button>
                      ))}
                    </div>
                  )}
                    </div>
                ) : debouncedQuery ? (
                     <div className="p-4 text-center text-gray-400">
                  No results found for "{debouncedQuery}"
                </div>
                ): null}
              </ScrollArea>)}
        </div>
             
           
           
        
 
      

        <div className='flex gap-4 items-center'>
            {
                isAdmin ? (
                    <div className='flex justify-center'>
                        <Link to={"/admin"} className={cn(
                            buttonVariants({
                                variant: "default"
                            })
                        )}>
                            <LayoutDashboardIcon className='size-4 mr-2'/>
                            Admin DashBoard
                        </Link>
                        <UserButton/>
                    </div>
                ) : (
                    <>
                        <SignedOut>
                            <SignInOAuthButton/>
                        </SignedOut>
                        <UserButton/>
                    </>
                  
                )
            }

           
        </div>
    </div>
  )
}

export default TopBar