export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export class NewsService {
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  static async fetchCryptoNews(query: string, page: number = 1): Promise<NewsResponse> {
    const url = `${this.BASE_URL}/news/crypto?query=${encodeURIComponent(query)}&page=${page}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch news');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new Error('Failed to fetch news. Please try again later.');
    }
  }

  static async fetchCommoditiesNews(query: string, page: number = 1): Promise<NewsResponse> {
    const url = `${this.BASE_URL}/news/commodities?query=${encodeURIComponent(query)}&page=${page}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch news');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching commodities news:', error);
      throw new Error('Failed to fetch commodities news. Please try again later.');
    }
  }

  static async fetchStockNews(query: string, page: number = 1): Promise<NewsResponse> {
    const url = `${this.BASE_URL}/news/stocks?query=${encodeURIComponent(query)}&page=${page}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch news');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching stock news:', error);
      throw new Error('Failed to fetch stock news. Please try again later.');
    }
  }

  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  static truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }
}
