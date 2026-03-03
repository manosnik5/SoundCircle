import { axiosInstance } from "@/lib/axios";
import type { User, Message } from "@/types";

export const chatApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get("/users");
    return response.data;
  },

  getMessages: async (userId: string): Promise<Message[]> => {
    const response = await axiosInstance.get(`/users/messages/${userId}`);
    return response.data;
  },

};