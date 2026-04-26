import { apiClient } from './client';
import { ENDPOINTS, APP_CONFIG } from '@/lib/constants';


export const booksAPI = {

  listBooks: async (page: number = 1): Promise<API.PagedResponse<API.BookSummary>> => {
    const response = await apiClient.get<API.PagedResponse<API.BookSummary>>(ENDPOINTS.BOOKS.LIST, {
      params: {
        page,
        pageSize: APP_CONFIG.ITEMS_PER_PAGE,
      },
    });
    return response.data;
  },

  getAuthoredBooks: async (): Promise<API.AuthoredBook[]> => {
    const response = await apiClient.get<API.AuthoredBook[]>(
      ENDPOINTS.BOOKS.AUTHORED
    );
    return Array.isArray(response.data) ? response.data : [];
  },

  getAuthoredBook: async (slug: string): Promise<API.BookDetail> => {
     const response = await apiClient.get<API.BookDetail | { book: API.BookDetail }>(ENDPOINTS.BOOKS.AUTHORED_DETAIL(slug));
    return ('chapters' in response.data) ? response.data : response.data.book;
  },

  getBook: async (slugOrId: string): Promise<API.BookDetail> => {
    const response = await apiClient.get<API.BookDetail | { book: API.BookDetail }>(ENDPOINTS.BOOKS.GET(slugOrId));
    return ('chapters' in response.data) ? response.data : response.data.book;
  },

  getChapter: async (bookId: string, chapterNumber: number): Promise<API.ChapterDetail> => {
    const response = await apiClient.get<{ chapter: API.ChapterDetail } | API.ChapterDetail>(
      ENDPOINTS.CHAPTERS.GET(bookId, chapterNumber)
    );
    return 'content' in response.data || 'chapterNumber' in response.data ? response.data as API.ChapterDetail : (response.data as any).chapter;
  },

  getLibrary: async (): Promise<API.LibraryItem[]> => {
    const response = await apiClient.get<API.LibraryItem[] | { items: API.LibraryItem[] }>(ENDPOINTS.PROGRESS.LIST);
    // Handle both response formats: direct array or wrapped in { items }
    return Array.isArray(response.data) ? response.data : response.data.items || [];
  },

  addToLibrary: async (bookId: string): Promise<void> => {
    await apiClient.post(`/books/${bookId}/library`);
  },

  removeFromLibrary: async (bookId: string): Promise<void> => {
    await apiClient.delete(`/books/${bookId}/library`);
  },

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

  updateProgress: async (bookId: string, progress: API.UpdateProgressRequest): Promise<void> => {
    await apiClient.post(ENDPOINTS.PROGRESS.UPDATE(bookId), progress);
  },

  searchBooks: async (q: string): Promise<API.BookSummary[]> => {
    const response = await apiClient.get<{ results: API.BookSummary[] }>(
      ENDPOINTS.BOOKS.SEARCH,
      { params: { q } }
    );
    return response.data.results ?? [];
  },

  createBook: async (data: API.CreateBookRequest): Promise<API.CreateBookResponse> => {
    const response = await apiClient.post<API.CreateBookResponse>(ENDPOINTS.BOOKS.CREATE, data);
    return response.data;
  },

  updateBook: async (id: string, data: any): Promise<API.BookDetail> => {
    const response = await apiClient.patch<{ book: API.BookDetail }>(
      ENDPOINTS.BOOKS.UPDATE(id),
      data
    );
    return response.data.book;
  },

  createChapter: async (
    bookId: string,
    data: {
      title?: string;
      content: Record<string, unknown>;
      chapter_number?: number;
      word_count?: number;
    }
  ): Promise<API.ChapterDetail> => {
    const response = await apiClient.post<{ chapter: API.ChapterDetail }>(
      ENDPOINTS.CHAPTERS.CREATE(bookId),
      data
    );
    return response.data.chapter;
  },

  deleteBook: async (bookId: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.BOOKS.UPDATE(bookId));
  },

  deleteChapter: async (bookId: string, chapterId: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.CHAPTERS.DELETE(bookId, chapterId));
  },

  getAuthoredChapter: async (bookId: string, chapterNumber: number): Promise<API.ChapterDetail> => {
    const response = await apiClient.get<{ chapter: API.ChapterDetail }>(
      `/user/books/${bookId}/chapters/${chapterNumber}`
    );
    return response.data.chapter;
  },

  updateChapter: async (
    bookId: string,
    chapterId: string,
    data: {
      title?: string;
      content?: Record<string, unknown>;
      word_count?: number;
      status?: string;
    }
  ): Promise<API.ChapterDetail> => {
    const response = await apiClient.patch<{ chapter: API.ChapterDetail }>(
      ENDPOINTS.CHAPTERS.UPDATE(bookId, chapterId),
      data
    );
    return response.data.chapter;
  },
};
