import { apiClient } from './client';
import { ENDPOINTS, APP_CONFIG } from '@/lib/constants';

/**
 * Books API Functions
 */

export const booksAPI = {
  /**
   * Get paginated list of all books
   */
  listBooks: async (page: number = 1): Promise<API.PagedResponse<API.BookSummary>> => {
    const response = await apiClient.get<API.PagedResponse<API.BookSummary>>(ENDPOINTS.BOOKS.LIST, {
      params: {
        page,
        pageSize: APP_CONFIG.ITEMS_PER_PAGE,
      },
    });
    return response.data;
  },

  /**
   * Get a specific book with chapters by slug
   */
  getBook: async (slug: string): Promise<API.BookDetail> => {
    const response = await apiClient.get<API.BookDetail | { book: API.BookDetail }>(ENDPOINTS.BOOKS.GET(slug));
    // Backend returns data directly, not wrapped
    return ('chapters' in response.data) ? response.data : response.data.book;
  },

  /**
   * Get a specific chapter
   */
  getChapter: async (bookId: string, chapterNumber: number): Promise<API.ChapterDetail> => {
    const response = await apiClient.get<{ chapter: API.ChapterDetail } | API.ChapterDetail>(
      ENDPOINTS.CHAPTERS.GET(bookId, chapterNumber)
    );
    return 'content' in response.data || 'chapterNumber' in response.data ? response.data as API.ChapterDetail : (response.data as any).chapter;
  },

  /**
   * Get user's library (books they're reading/have saved)
   */
  getLibrary: async (): Promise<API.LibraryItem[]> => {
    const response = await apiClient.get<API.LibraryItem[] | { items: API.LibraryItem[] }>(ENDPOINTS.PROGRESS.LIST);
    // Handle both response formats: direct array or wrapped in { items }
    return Array.isArray(response.data) ? response.data : response.data.items || [];
  },

  /**
   * Add a book to user's library
   */
  addToLibrary: async (bookId: string): Promise<void> => {
    await apiClient.post(`/books/${bookId}/library`);
  },

  /**
   * Remove a book from user's library
   */
  removeFromLibrary: async (bookId: string): Promise<void> => {
    await apiClient.delete(`/books/${bookId}/library`);
  },

  /**
   * Get reading progress for a book
   */
  getProgress: async (bookId: string): Promise<API.ProgressSummary | null> => {
    try {
      const response = await apiClient.get<{ progress: API.ProgressSummary }>(
        ENDPOINTS.PROGRESS.GET(bookId)
      );
      return response.data.progress;
    } catch {
      return null;
    }
  },

  /**
   * Update reading progress
   */
  updateProgress: async (bookId: string, progress: API.UpdateProgressRequest): Promise<void> => {
    await apiClient.post(ENDPOINTS.PROGRESS.UPDATE(bookId), progress);
  },

  /**
   * Create a new book (requires authentication)
   */
  createBook: async (data: any): Promise<API.BookDetail> => {
    const response = await apiClient.post<{ book: API.BookDetail }>(ENDPOINTS.BOOKS.CREATE, data);
    return response.data.book;
  },

  /**
   * Update a book (requires authentication and ownership)
   */
  updateBook: async (id: string, data: any): Promise<API.BookDetail> => {
    const response = await apiClient.patch<{ book: API.BookDetail }>(
      ENDPOINTS.BOOKS.UPDATE(id),
      data
    );
    return response.data.book;
  },

  /**
   * Create a new chapter for a book
   */
  createChapter: async (
    bookId: string,
    data: {
      title?: string;
      content: Record<string, unknown>; // TipTap JSON format
    }
  ): Promise<API.ChapterDetail> => {
    const response = await apiClient.post<{ chapter: API.ChapterDetail }>(
      ENDPOINTS.CHAPTERS.CREATE(bookId),
      data
    );
    return response.data.chapter;
  },

  /**
   * Update a chapter
   */
  updateChapter: async (
    bookId: string,
    chapterId: string,
    data: {
      title?: string;
      content?: Record<string, unknown>;
    }
  ): Promise<API.ChapterDetail> => {
    const response = await apiClient.patch<{ chapter: API.ChapterDetail }>(
      ENDPOINTS.CHAPTERS.UPDATE(bookId, chapterId),
      data
    );
    return response.data.chapter;
  },
};
