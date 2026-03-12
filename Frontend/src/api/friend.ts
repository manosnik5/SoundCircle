import { axiosInstance } from "@/lib/axios";
import type { FriendRequest, User } from "@/types";

export const friendApi = {
  sendFriendRequest: async (receiverId: string): Promise<FriendRequest> => {
    const response = await axiosInstance.post("/friends/request", { receiverId });
    return response.data;
  },

  acceptFriendRequest: async (requestId: string): Promise<void> => {
    await axiosInstance.post(`/friends/request/${requestId}/accept`);
  },

  rejectFriendRequest: async (requestId: string): Promise<void> => {
    await axiosInstance.post(`/friends/request/${requestId}/reject`);
  },

  getPendingRequests: async (): Promise<FriendRequest[]> => {
    const response = await axiosInstance.get("/friends/requests/pending");
    return response.data;
  },

  removeFriend: async (friendId: string): Promise<void> => {
    await axiosInstance.delete(`/friends/${friendId}`);
  },

  searchUsers: async (query: string): Promise<User[]> => {
    const response = await axiosInstance.get(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
}