import { Link } from 'react-router-dom'
import { HomeIcon, MessageCircle, Library, Bell } from 'lucide-react'
import { SignedIn, useAuth } from '@clerk/clerk-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area"
import PlaylistSkeleton from '@/components/skeletons/PlaylistSkeleton';
import { usePlaylists } from "@/hooks/useMusic";

const LeftSidebar = () => {
    const { isSignedIn } = useAuth();
    const { data: playlists, isLoading: playlistsLoading } = usePlaylists(isSignedIn);

    if (playlistsLoading) return <div>Loading...</div>;

  return (
    <div className='h-full flex flex-col gap-2'>
        <div className='bg-[#121212] rounded-lg p-4'>
            <div className='space-y-2'>
                <Link to={"/"}
                className={cn(
                    buttonVariants({ 
                        variant: "ghost",
                        className: "w-full justify-start text-white hover:bg-[#303030] hover:text-white"
                        }
                    ),
                )}>
                    <HomeIcon className='size-5 mr-2' />
                    <span className='hidden md:inline'>Home</span>
                </Link>

                <SignedIn>
                     <Link to={"/chat"}
                            className={cn(
                        buttonVariants({ 
                            variant: "ghost",
                            className: "w-full justify-start text-white hover:bg-[#303030] hover:text-white"
                            }
                        ),
                    )}>
                        <MessageCircle className='size-5 mr-2' />
                        <span className='hidden md:inline'>Messages</span>
                    </Link>
                     <Link to={"/friend-requests"}
                            className={cn(
                        buttonVariants({ 
                            variant: "ghost",
                            className: "w-full justify-start text-white hover:bg-[#303030] hover:text-white"
                            }
                        ),
                    )}>
                        <Bell className='size-5 mr-2' />
                        <span className='hidden md:inline'>Notifications</span>
                    </Link>
                </SignedIn>
            </div>
        </div>
        <div className='flex-1 bg-[#121212] rounded-lg p-4'>
            <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center text-white px-2'>
                    <Library className='size-5 mr-2' />
                    <span className='hidden md:inline'>Playlists</span>
                </div>
                <Link
                  to="/playlist"
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                      className: "hidden md:inline-flex items-center text-zinc-400 hover:text-white"
                    })
                  )}
                >
                  View all
                </Link>
            </div>
            
            <ScrollArea className='h-[calc(100vh-300px)]'>
                <div className='space-y-2'>
                    {playlistsLoading ? (
                        <PlaylistSkeleton />
                    ) : playlists && playlists.length > 0 ? (
                        playlists.map((playlist) => {
                          const playlistImage = playlist.imageUrl;
                          return (
                            <Link to={`/playlist/${playlist._id}`}
                              key={playlist._id}
                              className='p-2 rounded-md flex items-center gap-3 group cursor-pointer hover:bg-zinc-800'
                            >
                              {playlistImage ? (
                                <img src={playlistImage} alt="playlist image" className='size-12 rounded-md shrink-0 object-cover'/>
                              ) : (
                                <div className='size-12 rounded-md shrink-0 bg-zinc-800' />
                              )}
                              <div className='flex-1 min-w-0 hidden md:block'>
                                  <p className='font-medium truncate'>
                                      {playlist.title}
                                  </p>
                                  <p className='text-sm text-zinc-400 truncate'>
                                      {playlist.songs?.length ?? 0} {playlist.songs?.length === 1 ? 'song' : 'songs'}
                                  </p>
                              </div>
                            </Link>
                          );
                        })
                    ) : (
                        <div className='text-sm text-zinc-400 px-2'>
                          No playlists yet. Create one from the playlist page.
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    </div>
  )
}

export default LeftSidebar