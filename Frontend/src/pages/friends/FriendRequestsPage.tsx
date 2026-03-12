import { usePendingRequests, useAcceptFriendRequest, useRejectFriendRequest } from "@/hooks/useFriends";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, Check, X } from "lucide-react";
import TopBar from "@/components/TopBar";

const FriendRequestsPage = () => {
  const { data: requests, isLoading } = usePendingRequests();
  const acceptRequest = useAcceptFriendRequest();
  const rejectRequest = useRejectFriendRequest();

  const handleAccept = (requestId: string) => {
    acceptRequest.mutate(requestId);
  };

  const handleReject = (requestId: string) => {
    rejectRequest.mutate(requestId);
  };

  return (
    <div className="h-full bg-zinc-900 flex flex-col">
      <TopBar />

      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-linear-to-br from-blue-500 to-blue-700 p-3 rounded-lg">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Friend Requests</h1>
            <p className="text-zinc-400 text-sm">
              {requests?.length || 0} pending {requests?.length === 1 ? 'request' : 'requests'}
            </p>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-250px)]">
          {isLoading ? (
            <div className="text-center text-zinc-400 py-8">Loading...</div>
          ) : requests && requests.length > 0 ? (
            <div className="space-y-3">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="bg-zinc-800/40 p-4 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={request.senderInfo?.imageUrl} />
                      <AvatarFallback>{request.senderInfo?.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">{request.senderInfo?.fullName}</p>
                      <p className="text-sm text-zinc-400">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAccept(request._id)}
                      disabled={acceptRequest.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(request._id)}
                      disabled={rejectRequest.isPending}
                      className="border-zinc-700 cursor-pointer"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <UserPlus className="w-16 h-16 text-zinc-600 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">No pending requests</h2>
              <p className="text-sm text-zinc-400">You're all caught up!</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default FriendRequestsPage;