import { axiosInstance } from "@/lib/axios";
import type { Album, Song, User } from "@/types";

export const musicApi = {
    getSongs: async (): Promise<Song[]> => {
    const response = await axiosInstance.get("/songs");
    return response.data;
  },

    getAlbums: async (): Promise<Album[]> => {
        const response = await axiosInstance.get("/albums");
        return response.data;
    },
    getAlbumById: async (id: string): Promise<Album> => {
        const response = await axiosInstance.get(`/albums/${id}`);
        return response.data;
    },
    getUsers: async (): Promise<User[]> => {
        const response = await axiosInstance.get("/users");
        return response.data;
    }
}

