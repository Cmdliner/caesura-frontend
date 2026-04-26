import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { authAPI } from './auth';
import { booksAPI } from './books';
import { storiesAPI } from './stories';
import { APP_CONFIG } from '@/lib/constants';

/**
 * Auth Query Hooks
 */

export const useAuthQuery = {
  /**
   * Get user's library with caching
   */
  useLibrary: (options?: UseQueryOptions<API.LibraryItem[]>) =>
    useQuery({
      queryKey: ['library'],
      queryFn: () => booksAPI.getLibrary(),
      ...options,
      staleTime: APP_CONFIG.STALE_TIME,
      gcTime: APP_CONFIG.CACHE_TIME,
      placeholderData: [],
    }),

  /**
   * Get reading progress for a book
   */
  useProgress: (bookId: string, options?: UseQueryOptions<API.ProgressSummary | null>) =>
    useQuery({
      queryKey: ['progress', bookId],
      queryFn: () => booksAPI.getProgress(bookId),
      ...options,
      staleTime: APP_CONFIG.STALE_TIME,
      gcTime: APP_CONFIG.CACHE_TIME,
      enabled: !!bookId,
      placeholderData: null,
    }),
};

/**
 * Auth Mutation Hooks
 */

export const useAuthMutation = {
  /**
   * Login mutation
   */
  useLogin: (options?: UseMutationOptions<API.AuthResponse, unknown, any>) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ email, password }: { email: string; password: string }) =>
        authAPI.login(email, password),
      onSuccess: (data) => {
        queryClient.setQueryData(['auth'], data);
      },
      ...options,
    });
  },

  /**
   * Register mutation
   */
  useRegister: (options?: UseMutationOptions<API.AuthResponse, unknown, any>) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({
        email,
        username,
        password,
      }: {
        email: string;
        username: string;
        password: string;
      }) => authAPI.register(email, username, password),
      onSuccess: (data) => {
        queryClient.setQueryData(['auth'], data);
      },
      ...options,
    });
  },

  /**
   * Google auth mutation
   */
  useGoogleAuth: (options?: UseMutationOptions<API.AuthResponse, unknown, any>) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ idToken }: { idToken: string }) => authAPI.googleAuth(idToken),
      onSuccess: (data) => {
        queryClient.setQueryData(['auth'], data);
      },
      ...options,
    });
  },
};

/**
 * Book Query Hooks
 */

export const useBookQueries = {
  /**
   * Get paginated list of books
   */
  useBooks: (page: number = 1, options?: UseQueryOptions<API.PagedResponse<API.BookSummary>>) =>
    useQuery({
      queryKey: ['books', page],
      queryFn: () => booksAPI.listBooks(page),
      ...options,
      staleTime: APP_CONFIG.STALE_TIME,
      gcTime: APP_CONFIG.CACHE_TIME,
    }),

  /**
   * Get a specific book with all details
   */
  useBook: (slug: string, options?: UseQueryOptions<API.BookDetail>) =>
    useQuery({
      queryKey: ['book', slug],
      queryFn: () => booksAPI.getBook(slug),
      ...options,
      staleTime: APP_CONFIG.STALE_TIME,
      gcTime: APP_CONFIG.CACHE_TIME,
      enabled: !!slug,
      retry: 1,
    }),

  /**
   * Get a specific chapter
   */
  useChapter: (
    bookId: string,
    chapterNumber: number,
    options?: UseQueryOptions<API.ChapterDetail>
  ) =>
    useQuery({
      queryKey: ['chapter', bookId, chapterNumber],
      queryFn: () => booksAPI.getChapter(bookId, chapterNumber),
      ...options,
      staleTime: APP_CONFIG.STALE_TIME,
      gcTime: APP_CONFIG.CACHE_TIME,
      enabled: !!bookId && chapterNumber > 0,
      retry: 1,
    }),
};

/**
 * Book Mutation Hooks
 */

export const useBookMutation = {
  /**
   * Update reading progress mutation
   */
  useUpdateProgress: (options?: UseMutationOptions<void, unknown, any>) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ bookId, progress }: { bookId: string; progress: API.UpdateProgressRequest }) =>
        booksAPI.updateProgress(bookId, progress),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['progress', variables.bookId] });
        queryClient.invalidateQueries({ queryKey: ['library'] });
      },
      ...options,
    });
  },

  /**
   * Create book mutation
   */
  useCreateBook: (options?: UseMutationOptions<API.CreateBookResponse, unknown, any>) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: any) => booksAPI.createBook(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['books'] });
      },
      ...options,
    });
  },

  /**
   * Update book mutation
   */
  useUpdateBook: (options?: UseMutationOptions<API.BookDetail, unknown, any>) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) => booksAPI.updateBook(id, data),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['books'] });
        queryClient.invalidateQueries({ queryKey: ['book', data.slug] });
      },
      ...options,
    });
  },

  /**
   * Add book to library mutation
   */
  useAddToLibrary: (options?: UseMutationOptions<void, unknown, string>) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (bookId: string) => booksAPI.addToLibrary(bookId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['library'] });
      },
      ...options,
    });
  },

  /**
   * Remove book from library mutation
   */
  useRemoveFromLibrary: (options?: UseMutationOptions<void, unknown, string>) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (bookId: string) => booksAPI.removeFromLibrary(bookId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['library'] });
      },
      ...options,
    });
  },
};

/**
 * User Profile Query Hooks
 */

export const useProfileQuery = {
  /**
   * Get current user profile
   */
  useProfile: (options?: { enabled?: boolean }) =>
    useQuery<API.UserProfile>({
      queryKey: ['profile'],
      queryFn: () => authAPI.getProfile(),
      staleTime: APP_CONFIG.STALE_TIME,
      gcTime: APP_CONFIG.CACHE_TIME,
      ...options,
    }),

  /**
   * Get a specific user's profile by username
   */
  useUserProfile: (username: string, options?: { enabled?: boolean }) =>
    useQuery<API.UserProfile>({
      queryKey: ['user-profile', username],
      queryFn: () => storiesAPI.getUserProfile(username),
      staleTime: APP_CONFIG.STALE_TIME,
      gcTime: APP_CONFIG.CACHE_TIME,
      enabled: !!username,
      ...options,
    }),
};

/**
 * Stories Query Hooks
 */

export const useStoriesQuery = {
  /**
   * Get current user's stories
   */
  useUserStories: (options?: { enabled?: boolean }) =>
    useQuery<API.UserStory[]>({
      queryKey: ['user-stories'],
      queryFn: () => storiesAPI.getUserStories(),
      staleTime: APP_CONFIG.STALE_TIME,
      gcTime: APP_CONFIG.CACHE_TIME,
      placeholderData: [],
      ...options,
    }),

  /**
   * Get a specific story
   */
  useStory: (slug: string, options?: { enabled?: boolean }) =>
    useQuery<API.StoryDetail>({
      queryKey: ['story', slug],
      queryFn: () => storiesAPI.getStory(slug),
      staleTime: APP_CONFIG.STALE_TIME,
      gcTime: APP_CONFIG.CACHE_TIME,
      enabled: !!slug,
      ...options,
    }),
};

/**
 * Stories Mutation Hooks
 */

export const useStoriesMutation = {
  /**
   * Create new story
   */
  useCreateStory: (options?: UseMutationOptions<API.StoryDetail, unknown, API.CreateStoryRequest>) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: API.CreateStoryRequest) => storiesAPI.createStory(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user-stories'] });
      },
      ...options,
    });
  },

  /**
   * Update story
   */
  useUpdateStory: (options?: UseMutationOptions<API.StoryDetail, unknown, { id: string; data: API.UpdateStoryRequest }>) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: API.UpdateStoryRequest }) =>
        storiesAPI.updateStory(id, data),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['user-stories'] });
        queryClient.invalidateQueries({ queryKey: ['story', data.slug] });
      },
      ...options,
    });
  },

  /**
   * Delete story
   */
  useDeleteStory: (options?: UseMutationOptions<void, unknown, string>) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => storiesAPI.deleteStory(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user-stories'] });
      },
      ...options,
    });
  },

  /**
   * Publish story
   */
  usePublishStory: (options?: UseMutationOptions<API.StoryDetail, unknown, string>) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => storiesAPI.publishStory(id),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['user-stories'] });
        queryClient.invalidateQueries({ queryKey: ['story', data.slug] });
      },
      ...options,
    });
  },
};
