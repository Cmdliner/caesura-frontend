import { apiClient } from './client';
import { ENDPOINTS } from '@/lib/constants';

/**
 * Stories API Functions
 */

export const storiesAPI = {
  /**
   * Create a new story (Chapter 0 / Initial story)
   */
  createStory: async (data: API.CreateStoryRequest): Promise<API.StoryDetail> => {
    const response = await apiClient.post<{ story: API.StoryDetail }>(
      ENDPOINTS.STORIES.CREATE,
      data
    );
    return response.data.story;
  },

  /**
   * Get user's stories
   */
  getUserStories: async (): Promise<API.UserStory[]> => {
    const response = await apiClient.get<{ stories: API.UserStory[] } | API.UserStory[]>(
      ENDPOINTS.STORIES.LIST
    );
    return Array.isArray(response.data) ? response.data : response.data.stories;
  },

  /**
   * Get a specific story by slug
   */
  getStory: async (slug: string): Promise<API.StoryDetail> => {
    const response = await apiClient.get<{ story: API.StoryDetail } | API.StoryDetail>(
      ENDPOINTS.STORIES.GET(slug)
    );
    return 'id' in response.data ? response.data as API.StoryDetail : response.data.story;
  },

  /**
   * Update a story
   */
  updateStory: async (id: string, data: API.UpdateStoryRequest): Promise<API.StoryDetail> => {
    const response = await apiClient.patch<{ story: API.StoryDetail }>(
      ENDPOINTS.STORIES.UPDATE(id),
      data
    );
    return response.data.story;
  },

  /**
   * Delete a story
   */
  deleteStory: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.STORIES.DELETE(id));
  },

  /**
   * Publish a story
   */
  publishStory: async (id: string): Promise<API.StoryDetail> => {
    const response = await apiClient.post<{ story: API.StoryDetail }>(
      ENDPOINTS.STORIES.PUBLISH(id)
    );
    return response.data.story;
  },

  /**
   * Get user profile with their stories
   */
  getUserProfile: async (username: string): Promise<API.UserProfile> => {
    const response = await apiClient.get<{ user: API.UserProfile } | API.UserProfile>(
      ENDPOINTS.USERS.PROFILE(username)
    );
    return 'id' in response.data ? response.data as API.UserProfile : response.data.user;
  },
};
