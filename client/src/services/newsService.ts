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
  private static readonly BASE_URL = 'https://newsapi.org/v2/everything';
  private static readonly API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  static async fetchCryptoNews(query: string, page: number = 1): Promise<NewsResponse> {
    if (!this.API_KEY) {
      throw new Error('News API key not configured');
    }

    // Calculate date for last 24 hours
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const fromDate = yesterday.toISOString().split('T')[0];

    const params = new URLSearchParams({
      q: query,
      from: fromDate,
      sortBy: 'popularity',
      apiKey: this.API_KEY,
      language: 'en',
      pageSize: '10',
      page: page.toString()
    });

    const url = `${this.BASE_URL}?${params.toString()}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.status} ${response.statusText}`);
      }

      const data: NewsResponse = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error('News API returned an error status');
      }

      return data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new Error('Failed to fetch news. Please try again later.');
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
