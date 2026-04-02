import { STORAGE_KEYS } from './constants';


export const tokenManager = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    }
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    }
    return null;
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  },

  hasToken: (): boolean => {
    return tokenManager.getToken() !== null;
  },
};

export const userManager = {
  setUser: (user: API.User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  },

  getUser: (): API.User | null => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      try {
        return user ? JSON.parse(user) : null;
      } catch {
        return null;
      }
    }
    return null;
  },

  removeUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },
};

export const progressManager = {
  setProgress: (bookId: string, chapterId: string, scrollPosition: number) => {
    if (typeof window !== 'undefined') {
      const progress = progressManager.getAllProgress();
      progress[bookId] = {
        chapter_id: chapterId,
        scroll_position: scrollPosition,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEYS.READING_PROGRESS, JSON.stringify(progress));
    }
  },

  getProgress: (
    bookId: string
  ): { chapter_id: string; scroll_position: number; timestamp: number } | null => {
    if (typeof window !== 'undefined') {
      const progress = progressManager.getAllProgress();
      return progress[bookId] || null;
    }
    return null;
  },

  getAllProgress: (): Record<string, { chapter_id: string; scroll_position: number; timestamp: number }> => {
    if (typeof window !== 'undefined') {
      const progress = localStorage.getItem(STORAGE_KEYS.READING_PROGRESS);
      try {
        return progress ? JSON.parse(progress) : {};
      } catch {
        return {};
      }
    }
    return {};
  },

  removeProgress: (bookId: string) => {
    if (typeof window !== 'undefined') {
      const progress = progressManager.getAllProgress();
      delete progress[bookId];
      localStorage.setItem(STORAGE_KEYS.READING_PROGRESS, JSON.stringify(progress));
    }
  },
};

export const clearAuth = () => {
  tokenManager.removeToken();
  userManager.removeUser();
};

export const setAuth = (response: API.AuthResponse) => {
  tokenManager.setToken(response.token);
  userManager.setUser(response.user);
};

export const isErrorResponse = (error: unknown): error is { message: string; status?: number } => {
  return typeof error === 'object' && error !== null && 'message' in error;
};

export const getErrorMessage = (error: unknown): string => {
  if (isErrorResponse(error)) {
    return error.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

export const formatLastRead = (date: string): string => {
  const parsed = new Date(date);
  const now = new Date();
  const diff = now.getTime() - parsed.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;

  return parsed.toLocaleDateString();
};


export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};
