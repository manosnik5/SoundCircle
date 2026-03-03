import { useQuery } from "@tanstack/react-query";
import { chatApi  } from "@/api/chat";


export const chatKeys = {
    all: ["chat"] as const,
    users: () => [...chatKeys.all, "users"] as const,
    messages: (userId: string) => [...chatKeys.all, "messages", userId] as const,
}

export const useUsers = () => {
    return useQuery({
        queryKey: chatKeys.users(),
        queryFn: () => chatApi.getUsers(),
        staleTime: 1000 * 60 * 5,
    })
}

export const useMessages = (userId: string | null) => {
    return useQuery({
        queryKey: chatKeys.messages(userId || ""),
        queryFn: () => chatApi.getMessages(userId!),
        enabled: !!userId, 
        staleTime: 0,
    })
}



