import { 
  Bookmark, 
  CreateBookmarkRequest, 
  UpdateBookmarkRequest, 
  BookmarkResponse, 
  BookmarksResponse, 
  ToggleBookmarkResponse 
} from '@/types/bookmark';

class BookmarkService {
  private baseUrl = '/api/bookmarks';

  async getBookmarks(): Promise<Bookmark[]> {
    const response = await fetch(this.baseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch bookmarks');
    }

    const data: BookmarksResponse = await response.json();
    return data.bookmarks;
  }

  async getBookmarksByCategory(category: 'crypto' | 'stocks' | 'commodities'): Promise<Bookmark[]> {
    const response = await fetch(`${this.baseUrl}?category=${category}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch bookmarks by category');
    }

    const data: BookmarksResponse = await response.json();
    return data.bookmarks;
  }

  async createBookmark(bookmarkData: CreateBookmarkRequest): Promise<Bookmark> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookmarkData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create bookmark');
    }

    const data: BookmarkResponse = await response.json();
    return data.bookmark;
  }

  async updateBookmark(id: number, bookmarkData: UpdateBookmarkRequest): Promise<Bookmark> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookmarkData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update bookmark');
    }

    const data: BookmarkResponse = await response.json();
    return data.bookmark;
  }

  async deleteBookmark(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete bookmark');
    }
  }

  async toggleBookmark(bookmarkData: CreateBookmarkRequest): Promise<ToggleBookmarkResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...bookmarkData, action: 'toggle' }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to toggle bookmark');
    }

    return response.json();
  }

  async isBookmarked(category: 'crypto' | 'stocks' | 'commodities', symbol: string): Promise<boolean> {
    try {
      const bookmarks = await this.getBookmarks();
      return bookmarks.some(bookmark => 
        bookmark.category === category && bookmark.symbol === symbol
      );
    } catch {
      return false;
    }
  }
}

export const bookmarkService = new BookmarkService();
