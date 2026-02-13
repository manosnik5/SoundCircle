import { useQuery } from "@tanstack/react-query";
import { musicApi } from "@/api/music";

export const musicKeys = {
    all: ["music"] as const,
    songs: () => [...musicKeys.all, "songs"] as const,
    albums: () => [...musicKeys.all, "albums"] as const,
    Album: (id: string) => [...musicKeys.albums(), id] as const,
    users: () => [...musicKeys.all, "users"] as const,
}

export const useSongs = () => {
    return useQuery({
        queryKey: musicKeys.songs(),
        queryFn: musicApi.getSongs,
    })
}

export const useAlbums = () => {
    return useQuery({
        queryKey: musicKeys.albums(),
        queryFn: musicApi.getAlbums,
    })
}

export const useAlbum = (id: string) => {
    return useQuery({
        queryKey: musicKeys.Album(id),
        queryFn: () => musicApi.getAlbumById(id),
        enabled: !!id,
    })
}

export const useUsers = () => {
    return useQuery({
        queryKey: musicKeys.users(),
        queryFn: () => musicApi.getUsers(),
    })
}

