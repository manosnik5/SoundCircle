import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import { chatKeys } from "@/hooks/useChat";
import type { Message } from "@/types";


interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  sendMessage: (receiverId: string, senderId: string, content: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const baseURL = "http://localhost:5000";

export const SocketProvider = ({children}: { children: ReactNode }) => {
    const { userId } = useAuth();
    const queryClient = useQueryClient();

    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const [userActivities, setUserActivities] = useState<Map<string, string>>(new Map());

    useEffect(() => {
        if (!userId) return

        console.log("Initializing socket for user:", userId);

        const socket = io(baseURL, {
            auth: { userId },
            withCredentials: true,
        });

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
            setIsConnected(true);
            socket.emit("user_connected", userId);
        })

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
            setIsConnected(false);
        })

        socket.on("users_online", (users: string[]) => {
            console.log("Users online:", users);
            setOnlineUsers(new Set(users));
        })

        socket.on("activities", (activities: [string, string][]) => {
            console.log("Activities:", activities);
            setUserActivities(new Map(activities));
        });

        socket.on("user_connected", (connectedUserId: string) => {
            console.log("User connected:", connectedUserId);
            setOnlineUsers((prev) => new Set([...prev, connectedUserId]));
        });

        socket.on("user_disconnected", (disconnectedUserId: string) => {
            console.log("User disconnected:", disconnectedUserId);
            setOnlineUsers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(disconnectedUserId);
                return newSet;
            });
        });

        socket.on("receive_message", (message: Message) => {
            console.log("Message received:", message);
            
            queryClient.setQueryData<Message[]>(
                chatKeys.messages(message.senderId),
                (oldMessages = []) => [...oldMessages, message]
            );
        });

        socket.on("message_sent", (message: Message) => {
            console.log("Message sent confirmation:", message);
            
            queryClient.setQueryData<Message[]>(
                chatKeys.messages(message.receiverId),
                (oldMessages = []) => [...oldMessages, message]
            );
        });

        socket.on("message_error", (error: string) => {
            console.error("Message error:", error);
        });

        socket.on("activity_updated", ({ userId: activityUserId, activity }: any) => {
            console.log("Activity updated:", activityUserId, activity);
            setUserActivities((prev) => {
                const newMap = new Map(prev);
                newMap.set(activityUserId, activity);
                return newMap;
            });
        });

        setSocket(socket);

        return () => {
            console.log("Cleaning up socket");
            socket.disconnect();
            setSocket(null);
            setIsConnected(false);
        };

    }, [userId, queryClient])

    const sendMessage = useCallback(
        (receiverId: string, senderId: string, content: string) => {
        if (!socket || !isConnected || !userId) {
            console.error("Cannot send message: socket not connected");
            return;
        }

        console.log("Sending message:", { receiverId, senderId, content });
        socket.emit("send_message", { 
            senderId, 
            receiverId, 
            content 
        });
        },
        [socket, isConnected, userId]
    );

   return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        onlineUsers,
        userActivities,
        sendMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
    const context = useContext(SocketContext)
    if (!context) {
        throw new Error("useSocket must be used within SocketProvider");
    }
    return context;
}