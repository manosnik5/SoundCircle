import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { friendApi } from "@/api/friend";
import toast from "react-hot-toast";

export const friendKeys = {
  all: ["friends"] as const,
  pendingRequests: () => [...friendKeys.all, "pending"] as const,
  search: (query: string) => [...friendKeys.all, "search", query] as const,
};

export const usePendingRequests = () => {
  return useQuery({
    queryKey: friendKeys.pendingRequests(),
    queryFn: friendApi.getPendingRequests,
    staleTime: 1000 * 60, 
  });
};

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: friendKeys.search(query),
    queryFn: () => friendApi.searchUsers(query),
    enabled: query.length > 0,
    staleTime: 1000 * 30,
  });
};

export const useSendFriendRequest = () => {

  return useMutation({
    mutationFn: friendApi.sendFriendRequest,
    onSuccess: () => {
      toast.success("Friend request sent");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send request");
    },
  });
};

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: friendApi.acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendKeys.pendingRequests() });
      queryClient.invalidateQueries({ queryKey: ["chat", "users"] });
      toast.success("Friend request accepted");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to accept request");
    },
  });
};

export const useRejectFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: friendApi.rejectFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendKeys.pendingRequests() });
      toast.success("Friend request rejected");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to reject request");
    },
  });
};

export const useRemoveFriend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: friendApi.removeFriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", "users"] });
      toast.success("Friend removed");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove friend");
    },
  });
};