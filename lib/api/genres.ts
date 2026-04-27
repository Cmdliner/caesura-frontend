/**
 * Genre API client.
 *
 * Endpoints
 *   GET  /genres               → Genre[]
 *   GET  /genres/:slug/books   → PagedResponse<BookSummary>
 */

import { apiClient } from "./client";
import { ENDPOINTS } from "@/lib/constants";

export const genresAPI = {
  /** Returns all genres ordered by name, each with its published-book count. */
  listGenres: async (): Promise<API.Genre[]> => {
    const res = await apiClient.get<API.Genre[]>(ENDPOINTS.GENRES.LIST);
    return res.data ?? [];
  },

  /** Returns a paginated list of published books in the given genre slug. */
  getGenreBooks: async (
    slug: string,
    page = 1
  ): Promise<API.PagedResponse<API.BookSummary>> => {
    const res = await apiClient.get<API.PagedResponse<API.BookSummary>>(
      ENDPOINTS.GENRES.BOOKS(slug),
      { params: { page } }
    );
    return res.data;
  },
};
