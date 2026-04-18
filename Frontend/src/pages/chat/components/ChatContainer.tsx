import { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSocket } from "@/contexts/SocketContext";
import MessageInput from "./MessageInput";
import type { User, Message } from "@/types";

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

interface ClerkUser {
  id: string;
  imageUrl: string;
  fullName?: string | null;
}

interface ChatContainerProps {
  selectedUser: User;
  messages: Message[] | undefined;
  currentUser: ClerkUser;
}

const ChatContainer = ({ selectedUser, messages, currentUser }: ChatContainerProps) => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { onlineUsers } = useSocket();

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [messages]);

  return (
    <>
     <div className="p-3 sm:p-4 border-b border-zinc-800">
      <div className="flex items-center gap-2 sm:gap-3">
        <Avatar className="size-8 sm:size-10">
          <AvatarImage src={selectedUser.imageUrl} />
          <AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm sm:text-base">
            {selectedUser.fullName}
          </p>
          <p className="text-[10px] sm:text-xs text-zinc-400">
            {onlineUsers.has(selectedUser.clerkId) ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </div>

     <ScrollArea className="flex-1 min-h-0" ref={scrollAreaRef}>
      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages?.length ? (
          <>
            {messages.map(msg => {
              const own = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg._id}
                  className={`flex items-start gap-2 sm:gap-3 ${
                    own ? "justify-end" : "justify-start"
                  }`}
                >
                  {!own && (
                    <Avatar className="size-7 sm:size-8 shrink-0">
                      <AvatarImage src={selectedUser.imageUrl} />
                    </Avatar>
                  )}

                  <div
                    className={`rounded-lg p-2 sm:p-3 
                      max-w-[75%] sm:max-w-[40%] min-w-0
                      ${own ? "bg-[#694bcc]" : "bg-zinc-800"}
                    `}
                  >
                    <p className="text-xs sm:text-sm break-anywhere">
                      {msg.content}
                    </p>
                    <span className="text-[10px] sm:text-xs text-zinc-300 mt-1 block">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>

                  {own && (
                    <Avatar className="size-7 sm:size-8 shrink-0">
                      <AvatarImage src={currentUser.imageUrl} />
                    </Avatar>
                  )}
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
            No messages yet
          </div>
        )}
      </div>
    </ScrollArea>

    <MessageInput
      selectedUser={selectedUser}
      currentUserId={currentUser.id}
    />
  </>
  );
};

export default ChatContainer;