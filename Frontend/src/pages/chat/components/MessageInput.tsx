import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useSocket } from "@/contexts/SocketContext";
import type { User } from "@/types";

const MAX_MESSAGE_LENGTH = 1000;

interface MessageInputProps {
  selectedUser: User;
  currentUserId: string;
}

const MessageInput = ({ selectedUser, currentUserId }: MessageInputProps) => {
  const [messageInput, setMessageInput] = useState("");
  const { isConnected, sendMessage } = useSocket();

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    sendMessage(selectedUser.clerkId, currentUserId, messageInput.trim());
    setMessageInput("");
  };

  return (
    <div className="p-4 mt-4 border-t border-zinc-800">
      <div className="flex gap-2">
        <Input
          value={messageInput}
          onChange={e => setMessageInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="bg-zinc-800 border-none"
          maxLength={MAX_MESSAGE_LENGTH}
        />
        <Button
          type="submit"
          size="icon"
          onClick={handleSendMessage}
          disabled={!messageInput.trim() || !isConnected}
          className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
