import { useQuery } from "@tanstack/react-query";
import { musicApi } from "@/api/music";

export const musicKeys = {
    all: ["music"] as const,
    songs: () => [...musicKeys.all, "songs"] as const,
    featuredSongs: () => [...musicKeys.all, "featured"] as const,
  madeForYouSongs: () => [...musicKeys.all, "made-for-you"] as const,
  trendingSongs: () => [...musicKeys.all, "trending"] as const,
    albums: () => [...musicKeys.all, "albums"] as const,
    Album: (id: string) => [...musicKeys.albums(), id] as const,
    users: () => [...musicKeys.all, "users"] as const,
    admin: () => [...musicKeys.all, "admin"] as const,
}

export const useSongs = () => {
    return useQuery({
        queryKey: musicKeys.songs(),
        queryFn: musicApi.getSongs,
    })
}

export const useFeaturedSongs = () => {
  return useQuery({
    queryKey: musicKeys.featuredSongs(),
    queryFn: musicApi.getFeaturedSongs,
    staleTime: 1000 * 60 * 5, 
  });
};


export const useMadeForYouSongs = () => {
  return useQuery({
    queryKey: musicKeys.madeForYouSongs(),
    queryFn: musicApi.getMadeForYouSongs,
    staleTime: 1000 * 60 * 5, 
  });
};

// Trending Songs Hook
export const useTrendingSongs = () => {
  return useQuery({
    queryKey: musicKeys.trendingSongs(),
    queryFn: musicApi.getTrendingSongs,
    staleTime: 1000 * 60 * 5,
  });
};

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

export const useAdminCheck = () => {
   return useQuery({
    queryKey: musicKeys.admin(),
    queryFn: musicApi.checkAdmin,
    staleTime: 1000 * 60 * 5, 
    retry: false, 
    select: (data) => data.admin, 
  });
}

