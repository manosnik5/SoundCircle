import { axiosInstance } from "@/lib/axios";
import type { Album, Song, User } from "@/types";

export const musicApi = {
    getSongs: async (): Promise<Song[]> => {
        const response = await axiosInstance.get("/songs");
        return response.data;
    },
    getFeaturedSongs: async (): Promise<Song[]> => {
        const response = await axiosInstance.get("/songs/featured");
        return response.data;
    },
    getMadeForYouSongs: async (): Promise<Song[]> => {
        const response = await axiosInstance.get("/songs/made-for-you");
        return response.data;
    },
    getTrendingSongs: async (): Promise<Song[]> => {
        const response = await axiosInstance.get("/songs/trending");
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
    },
    checkAdmin: async (): Promise<{ admin: boolean }> => {
        const response = await axiosInstance.get("/admin/check");
        return response.data;
    },
    searchSongs: async (query: string): Promise<Song[]> => {
        const response = await axiosInstance.get(`/songs/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },
    searchAlbums: async (query: string): Promise<Album[]> => {
        const response = await axiosInstance.get(`/albums/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },
}

