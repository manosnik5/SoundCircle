import { useState, useEffect } from "react";
import { useSearchUsers, useSendFriendRequest } from "@/hooks/useFriends";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, UserPlus } from "lucide-react";
import TopBar from "@/components/TopBar";

const AddFriendsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  
  const { data: users, isLoading } = useSearchUsers(debouncedQuery);
  const sendRequest = useSendFriendRequest();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSendRequest = (userId: string) => {
    sendRequest.mutate(userId);
  };

  return (
    <div className="h-full bg-zinc-900 flex flex-col">
      <TopBar />

      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-linear-to-br from-emerald-500 to-emerald-700 p-3 rounded-lg">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Add Friends</h1>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for users..."
            className="pl-10 bg-zinc-800 border-zinc-700"
          />
        </div>

        <ScrollArea className="h-[calc(100vh-300px)]">
          {isLoading ? (
            <div className="text-center text-zinc-400 py-8">Searching...</div>
          ) : users && users.length > 0 ? (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="bg-zinc-800/40 p-4 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <p className="font-medium text-white">{user.fullName}</p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleSendRequest(user.clerkId)}
                    disabled={sendRequest.isPending}
                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Add Friend
                  </Button>
                </div>
              ))}
            </div>
          ) : debouncedQuery ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
              <Search className="w-16 h-16 text-zinc-600 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">No users found</h2>
              <p className="text-sm text-zinc-400">Try a different search term</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
              <UserPlus className="w-16 h-16 text-zinc-600 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Search for friends</h2>
              <p className="text-sm text-zinc-400">Start typing to find users</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default AddFriendsPage;