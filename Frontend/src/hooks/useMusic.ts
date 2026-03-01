import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { musicApi } from "@/api/music";
import toast from "react-hot-toast";

export const musicKeys = {
    all: ["music"] as const,
    songs: () => [...musicKeys.all, "songs"] as const,
    featuredSongs: () => [...musicKeys.all, "featured"] as const,
    madeForYouSongs: () => [...musicKeys.all, "made-for-you"] as const,
    trendingSongs: () => [...musicKeys.all, "trending"] as const,
    albums: () => [...musicKeys.all, "albums"] as const,
    stats: () => [...musicKeys.all, "stats"] as const,
    Album: (id: string) => [...musicKeys.albums(), id] as const,
    users: () => [...musicKeys.all, "users"] as const,
    admin: () => [...musicKeys.all, "admin"] as const,
    searchSongs: (query: string) => [...musicKeys.all, "search", "songs", query] as const,
    searchAlbums: (query: string) => [...musicKeys.all, "search", "albums", query] as const,
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

export const useStats = (enabled: boolean = true) => {
  return useQuery({
    queryKey: musicKeys.stats(),
    queryFn: musicApi.getStats,
    enabled: enabled, 
    staleTime: 1000 * 60 * 5,
  });
};

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

export const useSearchSongs = (query: string) => {
  return useQuery({
    queryKey: musicKeys.searchSongs(query),
    queryFn: () => musicApi.searchSongs(query),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSearchAlbums = (query: string) => {
  return useQuery({
    queryKey: musicKeys.searchAlbums(query),
    queryFn: () => musicApi.searchAlbums(query),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDeleteSong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: musicApi.deleteSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: musicKeys.songs() });
      queryClient.invalidateQueries({ queryKey: musicKeys.featuredSongs() });
      queryClient.invalidateQueries({ queryKey: musicKeys.madeForYouSongs() });
      queryClient.invalidateQueries({ queryKey: musicKeys.trendingSongs() });
      queryClient.invalidateQueries({ queryKey: musicKeys.stats() });
      
       toast.success("Song deleted successfully");
    },
     onError: (error: any) => {
      console.error("Error deleting song:", error);
      toast.error(error.response?.data?.message || "Failed to delete song");
    },
  });
};

export const useDeleteAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: musicApi.deleteAlbum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: musicKeys.albums() });
      queryClient.invalidateQueries({ queryKey: musicKeys.songs() });
      queryClient.invalidateQueries({ queryKey: musicKeys.stats() });
      
      toast.success("Album deleted successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting album:", error);
      toast.error(error.response?.data?.message || "Failed to delete album");
    },
  });
};

