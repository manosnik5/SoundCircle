import { useUsers } from "@/hooks/useChat";
import { useUser } from "@clerk/clerk-react";
import LoginPromptFriends from "@/components/LoginPromptFriends";
import { Music, PlusCircle, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSocket } from "@/contexts/SocketContext";
import TopBar from "@/components/TopBar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const FriendsPage = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { data: users, isLoading: usersLoading } = useUsers();
  const { onlineUsers, userActivities } = useSocket();

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

  if (!isLoaded) return null;

  if (!user) {
    return <LoginPromptFriends />;
  }

  if (usersLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-zinc-900">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-zinc-900 flex flex-col">
      <TopBar />
      
      <div className="p-4 border-b border-zinc-800 bg-zinc-800/50">
        <div className='flex items-center gap-3'>
          <div className="bg-linear-to-br from-emerald-500 to-emerald-700 p-2 rounded-lg">
            <Users className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-xl font-semibold text-white'>Friends Activity</h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              {users?.length || 0} {users?.length === 1 ? 'friend' : 'friends'}
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 border-b border-zinc-800 bg-zinc-800/50">
        <div className='flex items-center gap-3'>
          
          <div>
            <h1 className='text-xl font-semibold text-white'>Add Friend</h1>
          </div>
          <Link to={"/add-friends"} className="p-2 rounded-lg border cursor-pointer">
            <PlusCircle className='w-6 h-6 text-white ' />
          </Link>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {users && users.length > 0 ? (
            users.map((friendUser) => {
              const isOnline = onlineUsers.has(friendUser.clerkId);
              const activity = userActivities.get(friendUser.clerkId);
              const isPlaying = activity && activity !== "Idle";

              return (
                <div 
                  key={friendUser._id} 
                  className='p-4 rounded-lg bg-zinc-800/40 hover:bg-zinc-800/60 transition-colors'
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12 border-2 border-zinc-700">
                        <AvatarImage src={friendUser.imageUrl} alt={friendUser.fullName} />
                        <AvatarFallback>{friendUser.fullName[0]}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-zinc-900 ${
                          isOnline ? "bg-emerald-500" : "bg-zinc-500"
                        }`}
                        aria-hidden='true'
                      />
                    </div>

                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2 mb-1'>
                        <span className='font-semibold text-white'>
                          {friendUser.fullName}
                        </span>
                        {isPlaying && (
                          <Music className='w-3.5 h-3.5 text-emerald-400' />
                        )}
                      </div>

                      {isPlaying ? (
                        <div className="space-y-0.5">
                          <p className="text-sm text-emerald-400 font-medium truncate">
                            {activity}
                          </p>
                          <p className="text-xs text-zinc-500">Listening now</p>
                        </div>
                      ) : (
                        <p className="text-sm text-zinc-400">
                          {isOnline ? "Online" : "Offline"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
              <Users className="w-16 h-16 text-zinc-600 mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">No friends yet</h2>
                <p className="text-sm text-zinc-400">Connect with others to see their activity</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FriendsPage;