import { axiosInstance } from "@/lib/axios";
import type { Album, Song, Stats, User, Playlist } from "@/types";

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
    deleteSong: async (id: string): Promise<void> => {
        const response = await axiosInstance.delete(`/admin/songs/${id}`);
        return response.data;
    },
    deleteAlbum: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/admin/albums/${id}`);
  },
    getUsers: async (): Promise<User[]> => {
        const response = await axiosInstance.get("/users");
        return response.data;
    },
    getPlaylists: async (): Promise<Playlist[]> => {
        const response = await axiosInstance.get("/playlists");
        return response.data;
    },
    createPlaylist: async (data: { title: string; description?: string }): Promise<Playlist> => {
        const response = await axiosInstance.post("/playlists", data);
        return response.data;
    },
    addSongToPlaylist: async (playlistId: string, songId: string): Promise<Playlist> => {
        const response = await axiosInstance.post(`/playlists/${playlistId}/songs`, { songId });
        return response.data;
    },
    getPlaylistById: async (playlistId: string): Promise<Playlist> => {
        const response = await axiosInstance.get(`/playlists/${playlistId}`);
        return response.data;
    },
    updatePlaylist: async (playlistId: string, data: FormData): Promise<Playlist> => {
        const response = await axiosInstance.put(`/playlists/${playlistId}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
    deletePlaylist: async (playlistId: string): Promise<void> => {
        await axiosInstance.delete(`/playlists/${playlistId}`);
    },
    removeSongFromPlaylist: async (playlistId: string, songId: string): Promise<Playlist> => {
        const response = await axiosInstance.delete(`/playlists/${playlistId}/songs/${songId}`);
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
    getStats: async (): Promise<Stats> => {
        const response = await axiosInstance.get("/stats");
        return response.data;
    },
}

