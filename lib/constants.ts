// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
export const API_TIMEOUT = 30000;

// Endpoints
export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    GOOGLE: '/auth/google',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  // Books
  BOOKS: {
    LIST: '/books',
    SEARCH: '/books/search',
    GET: (slug: string) => `/books/${slug}`,
    CREATE: '/books',
    UPDATE: (id: string) => `/books/${id}`,
    AUTHORED: '/user/books/authored',
    AUTHORED_DETAIL: (slug: string) => `/user/books/authored/${slug}`,
  },
  // Chapters
  CHAPTERS: {
    GET: (bookId: string, chapterNumber: number) => `/books/${bookId}/chapters/${chapterNumber}`,
    CREATE: (bookId: string) => `/books/${bookId}/chapters`,
    UPDATE: (bookId: string, chapterId: string) => `/books/${bookId}/chapters/${chapterId}`,
    DELETE: (bookId: string, chapterId: string) => `/books/${bookId}/chapters/${chapterId}`,
  },
  // Progress
  PROGRESS: {
    LIST: '/books/library/me',
    GET: (bookId: string) => `/books/${bookId}/progress`,
    UPDATE: (bookId: string) => `/books/${bookId}/progress`,
  },
  // Stories
  STORIES: {
    CREATE: '/stories',
    LIST: '/stories/me',
    GET: (slug: string) => `/stories/${slug}`,
    UPDATE: (id: string) => `/stories/${id}`,
    DELETE: (id: string) => `/stories/${id}`,
    PUBLISH: (id: string) => `/stories/${id}/publish`,
  },
  // Genres
  GENRES: {
    LIST: '/genres',
    BOOKS: (slug: string) => `/genres/${slug}/books`,
  },
  // Users
  USERS: {
    PROFILE: (username: string) => `/users/${username}/profile`,
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'caesura_auth_token',
  USER: 'caesura_user',
  READING_PROGRESS: 'caesura_reading_progress',
};

// App Configuration
export const APP_CONFIG = {
  ITEMS_PER_PAGE: 20,
  CACHE_TIME: 5 * 60 * 1000, // 5 minutes
  STALE_TIME: 3 * 60 * 1000, // 3 minutes
};
