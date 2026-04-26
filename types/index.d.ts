declare global {
  namespace API {
    // Auth Types
    interface User {
      id: string;
      email: string;
      username: string;
      display_name?: string;
      avatar_url?: string;
      bio?: string;
      created_at: string;
    }

    interface AuthResponse {
      token: string;
      user: User;
    }

    interface LoginRequest {
      email: string;
      password: string;
    }

    interface RegisterRequest {
      email: string;
      username: string;
      password: string;
      confirm_password: string;
    }

    interface GoogleAuthRequest {
      id_token: string;
    }

    // Book Types
    interface Author {
      id: string;
      username: string;
      display_name?: string;
      avatar_url?: string;
    }

    interface ChapterSummary {
      id: string;
      chapter_number: number;
      title?: string;
      word_count?: number;
      published_at?: string;
    }

    interface BookDetail {
      id: string;
      title: string;
      slug: string;
      description?: string;
      cover_url?: string;
      language: string;
      status: string;
      source: string;
      total_views: number;
      created_at: string;
      author?: Author;
      gutenberg_authors?: string[];
      chapters: ChapterSummary[];
    }

    interface BookSummary {
      id: string;
      title: string;
      slug: string;
      description?: string;
      author_name?: string;
      authors?: string[];
      cover_url?: string;
      language: string;
      status: string;
      total_views: number;
      created_at: string;
    }

    interface AuthoredBook {
      id: string;
      title: string;
      slug: string;
      description?: string;
      status: string;
      cover_url?: string;
      created_at: string;
      updated_at: string;
      chapter_count: number;
      total_word_count: number;
    }

    interface ProgressSummary {
      chapter_id: string;
      chapter_number: number;
      scroll_position: number;
      last_read_at: string;
    }

    interface CreateBookResponse {
      book_id: string;
      title: string;
      slug: string;
    }

    interface LibraryItem {
      book_id: string;
      added_at: string;
      title: string;
      slug: string;
      cover_url?: string;
      total_views: number;
      progress?: ProgressSummary;
    }

    interface ChapterDetail {
      id: string;
      book_id: string;
      chapter_number: number;
      title?: string;
      content?: Record<string, unknown>;
      content_html?: string;
      word_count?: number;
      published_at?: string;
    }

    interface PagedResponse<T> {
      items: T[];
      /** 1-based current page */
      page: number;
      /** Items per page */
      limit: number;
      /** Total item count across all pages */
      total: number;
      /** Computed: Math.ceil(total / limit) */
      total_pages: number;
      has_more: boolean;
    }

    interface UpdateProgressRequest {
      chapter_id: string;
      scroll_position: number;
    }

    interface CreateBookRequest {
      title: string;
      description?: string;
      cover_url?: string;
      language?: string;
      authors?: string[];
      genre_ids?: number[];
    }

    // User Profile Types
    interface UserProfile extends User {
      follower_count: number;
      following_count: number;
      stories_count: number;
      total_reads: number;
      stories: UserStory[];
    }

    interface UserStory {
      id: string;
      title: string;
      slug: string;
      description?: string;
      status: "draft" | "published";
      created_at: string;
      updated_at: string;
      views_count: number;
    }

    interface CreateStoryRequest {
      title: string;
      description?: string;
      content: Record<string, unknown>;
      status: "draft" | "published";
    }

    interface UpdateStoryRequest {
      title?: string;
      description?: string;
      content?: Record<string, unknown>;
      status?: "draft" | "published";
    }

    interface StoryDetail {
      id: string;
      title: string;
      slug: string;
      description?: string;
      status: "draft" | "published";
      author?: Author;
      created_at: string;
      updated_at: string;
      views_count: number;
      word_count: number;
      chapters?: ChapterDetail[];
    }
  }
}

export {};