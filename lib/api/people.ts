import { apiClient } from "./client";
import { ENDPOINTS } from "@/lib/constants";

export const peopleAPI = {
  search: async (params: { q?: string; filter?: "writers"; page?: number; limit?: number }) => {
    const response = await apiClient.get<API.PagedResponse<API.Person>>(ENDPOINTS.USERS.LIST, {
      params: { q: params.q || undefined, filter: params.filter, page: params.page ?? 1, limit: params.limit ?? 24 },
    });
    return response.data;
  },

  getProfile: async (username: string) => {
    const response = await apiClient.get<API.PublicProfile>(ENDPOINTS.USERS.PROFILE(username));
    return response.data;
  },

  follow: async (username: string) => {
    const response = await apiClient.post<API.FollowResult>(ENDPOINTS.USERS.FOLLOW(username));
    return response.data;
  },

  unfollow: async (username: string) => {
    const response = await apiClient.delete<API.FollowResult>(ENDPOINTS.USERS.FOLLOW(username));
    return response.data;
  },

  followers: async (username: string, page = 1) => {
    const response = await apiClient.get<API.PagedResponse<API.Person>>(ENDPOINTS.USERS.FOLLOWERS(username), {
      params: { page },
    });
    return response.data;
  },

  following: async (username: string, page = 1) => {
    const response = await apiClient.get<API.PagedResponse<API.Person>>(ENDPOINTS.USERS.FOLLOWING(username), {
      params: { page },
    });
    return response.data;
  },
};
