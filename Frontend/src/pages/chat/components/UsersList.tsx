import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSocket } from "@/contexts/SocketContext";
import UsersListSkeleton from "@/components/skeletons/UserListSkeleton";
import type { User } from "@/types";

interface UsersListProps {
  users: User[] | undefined;
  usersLoading: boolean;
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

const UsersList = ({ users, usersLoading, selectedUserId, onSelectUser }: UsersListProps) => {
  const { onlineUsers, userActivities } = useSocket();

  return (
    <div className='border-r border-zinc-800'>
      <div className='flex flex-col h-full'>
        <div className="p-4 self-center">
          <span className="font-semibold text-sm lg:text-xl">Friends</span>
        </div>
        
        <ScrollArea className="flex-1 ">
          <div className="p-2 space-y-2">
            {usersLoading ? (
              <UsersListSkeleton />
            ) : (
              users?.map(user => {
                const isOnline = onlineUsers.has(user.clerkId);
                const activity = userActivities.get(user.clerkId);

                return (
                  <button
                    key={user._id}
                    onClick={() => onSelectUser(user.clerkId)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition cursor-pointer
                      hover:bg-zinc-800 ${
                        selectedUserId === user.clerkId ? "bg-zinc-800" : ""
                      }`}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={user.imageUrl} />
                        <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                      </Avatar>
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-zinc-900" />
                      )}
                    </div>

                    <div className="hidden md:block text-left min-w-0">
                      <p className="font-medium truncate">{user.fullName}</p>
                      {activity && activity !== "Idle" ? (
                        <div className='mt-1'>
												<div className='mt-1 text-xs text-white font-medium truncate'>
													{activity.replace("Playing ", "").split(" by ")[0]}
												</div>
												<div className='text-[11px] text-zinc-400 truncate'>
													{activity.split(" by ")[1]}
												</div>
											</div>
                      ) : (
                        <p className="text-xs text-zinc-400">
                          {isOnline ? "Online" : "Offline"}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default UsersList;