import { useUsers } from "@/hooks/useMusic"
import { useUser } from "@clerk/clerk-react";
import LoginPromptFriends from "@/components/LoginPromptFriends";
import { Music, UserPlus, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSocket } from "@/contexts/SocketContext";
import { Link } from "react-router-dom";


const FriendsActivity = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (!user) {
    return <LoginPromptFriends />;
  }

  const { data: users, isLoading: usersLoading } = useUsers();
  const { onlineUsers, userActivities } = useSocket();

  console.log(onlineUsers, userActivities)

  if ( usersLoading ) return <div>Loading...</div>;

  return (
    <div className="h-full bg-[#1a1b1d] rounded-lg flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-zinc-800">
        <div className='flex items-center gap-2'>
					<Users className='size-5 shrink-0' />
					<h2 className='font-semibold'>What they're listening to</h2>
				</div>
      </div>
      <div className="p-4 flex justify-between items-center border-b border-zinc-800">
					<Link to={"/add-friends"} className='flex items-center gap-2'>
            Add Friend
            <UserPlus className="size-5" />
          </Link>
      </div>
      <ScrollArea  className="flex-1">
        <div className="p-4 space-y-4">
          {users?.map((user) => { 
            const isOnline = onlineUsers.has(user.clerkId);
            const activity = userActivities.get(user.clerkId);
            const isPlaying = activity && activity !== "Idle";
            return (
            <div key={user._id} className='cursor-pointer hover:bg-zinc-800/50 p-3 rounded-md transition-colors group'>
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="size-10 border border-zinc-800">
                    <AvatarImage src={user.imageUrl} alt= {user.fullName}/>
                    <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                  </Avatar>
                    <div
											className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 ${
                        isOnline ? "bg-emerald-500" : "bg-zinc-500"
                      }`}
											aria-hidden='true'
										/>
                </div>
                <div className='flex-1 min-w-0'>
									<div className='flex items-center gap-2'>
										<span className='font-medium text-sm text-white'>
                      {user.fullName}
                    </span>
           
									</div>
                  {isPlaying ? (
                      <p className="text-xs text-emerald-500 flex items-center gap-1 truncate">
                          <Music className="w-3 h-3" />
                          {activity}
                        </p>
                    ) : (
                      <div className="mt-1 text-xs text-zinc-400">Online</div>
                    )}
                    </div>
              </div>
            </div>
          )})}
        </div>
      </ScrollArea >
    </div>
  )
}

export default FriendsActivity