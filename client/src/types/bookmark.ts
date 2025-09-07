export interface Bookmark {
  id: number;
  category: 'crypto' | 'stocks' | 'commodities';
  symbol: string;
  userId: number;
  createdAt: string;
}

export interface CreateBookmarkRequest {
  category: 'crypto' | 'stocks' | 'commodities';
  symbol: string;
}

export interface UpdateBookmarkRequest {
  category?: 'crypto' | 'stocks' | 'commodities';
  symbol?: string;
}

export interface BookmarkResponse {
  bookmark: Bookmark;
}

export interface BookmarksResponse {
  bookmarks: Bookmark[];
}

export interface ToggleBookmarkResponse {
  action: 'added' | 'removed';
  bookmark: Bookmark | null;
}

export interface BookmarkError {
  error: string;
  details?: unknown;
}
