import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useUsers, useMessages } from "@/hooks/useChat";
import TopBar from "@/components/TopBar";
import UsersList from "./components/UsersList";
import { usePlayer } from "@/contexts/MusicPlayerContext";
import ChatContainer from "./components/ChatContainer";
import { MessageCircle } from "lucide-react";

const ChatPage = () => {
  const { user } = useUser();
  const [isMobile, setIsMobile] = useState(false)
  const { currentSong } = usePlayer();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  


  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: messages } = useMessages(selectedUserId);

  const selectedUser = users?.find(u => u.clerkId === selectedUserId);

  useEffect(() => {
        const handleMobile = () => {
          setIsMobile(window.innerWidth < 768);
        }
  
        handleMobile()
        window.addEventListener("resize", handleMobile)
  
        return () => window.removeEventListener("resize", handleMobile)
      }, [])
  return (
    <div
      className={`h-full rounded-lg bg-zinc-900 overflow-hidden flex flex-col ${
        isMobile
          ? currentSong
            ? "pb-35"
            : "pb-16"
          : "pb-0"
      }`}
    >
      <TopBar />
      <div className="grid lg:grid-cols-[240px_1fr] md:grid-cols-[200px_1fr] grid-cols-[80px_1fr] flex-1 min-h-0">
        <UsersList
          users={users}
          usersLoading={usersLoading}
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
        />

        <section className="flex-1 flex flex-col min-h-0">
          {selectedUser && user ? (
            <ChatContainer
              selectedUser={selectedUser}
              messages={messages}
              currentUser={user}
            />
          ) : (
            <NoConversationPlaceholder />
          )}
        </section>
      </div>
    </div>
  );
};

export default ChatPage;

const NoConversationPlaceholder = () => (
  <div className="flex-1 flex items-center justify-center text-zinc-400">
    <div className="text-center">
      <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
      <p className="text-xl font-semibold text-white">No chat selected</p>
      <p className="text-sm">Select a friend to start chatting</p>
    </div>
  </div>
);