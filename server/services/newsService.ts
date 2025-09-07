import { redisService } from './redisService';

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
  cached: boolean;
  cacheExpiry?: number;
}

export class NewsService {
  private static readonly BASE_URL = 'https://newsapi.org/v2/everything';
  private static readonly API_KEY = process.env.NEWS_API_KEY;

  /**
   * Fetch crypto news with Redis caching
   */
  static async fetchCryptoNews(query: string, page: number = 1): Promise<NewsResponse> {
    return this.fetchNews('crypto', query, page);
  }

  /**
   * Fetch commodities news with Redis caching
   */
  static async fetchCommoditiesNews(query: string, page: number = 1): Promise<NewsResponse> {
    return this.fetchNews('commodities', query, page);
  }

  /**
   * Fetch stock news with Redis caching
   */
  static async fetchStockNews(query: string, page: number = 1): Promise<NewsResponse> {
    return this.fetchNews('stocks', query, page);
  }

  /**
   * Fetch top headlines with Redis caching
   */
  static async fetchTopHeadlines(country: string = 'us', category: string = 'business', pageSize: number = 10): Promise<NewsResponse> {
    if (!this.API_KEY) {
      throw new Error('News API key not configured');
    }

    // Generate cache key for top headlines
    const cacheKey = redisService.generateNewsCacheKey(`top_headlines:${country}:${category}`, 1);
    
    try {
      // Check cache first
      const cachedData = await redisService.get(cacheKey);
      if (cachedData) {
        console.log(`Cache hit for top headlines: ${country}:${category}`);
        return {
          ...cachedData,
          cached: true,
          cacheExpiry: await redisService.getTTL(cacheKey)
        };
      }

      // Cache miss - fetch from API
      console.log(`Cache miss for top headlines: ${country}:${category} - fetching from API`);
      const apiData = await this.fetchTopHeadlinesFromAPI(country, category, pageSize);
      
      // Cache the response for 24 hours
      await redisService.set(cacheKey, {
        ...apiData,
        cached: false
      });

      return {
        ...apiData,
        cached: false
      };

    } catch (error) {
      console.error('Error in fetchTopHeadlines:', error);
      
      // If Redis fails, try to fetch from API directly
      if (error instanceof Error && error.message.includes('Redis')) {
        console.log('Redis failed, fetching top headlines directly from API');
        return await this.fetchTopHeadlinesFromAPI(country, category, pageSize);
      }
      
      throw error;
    }
  }

  /**
   * Generic method to fetch news for any category
   */
  private static async fetchNews(category: string, query: string, page: number = 1): Promise<NewsResponse> {
    if (!this.API_KEY) {
      throw new Error('News API key not configured');
    }

    // Generate cache key with category prefix
    const cacheKey = redisService.generateNewsCacheKey(`${category}:${query}`, page);
    
    try {
      // Check cache first
      const cachedData = await redisService.get(cacheKey);
      if (cachedData) {
        console.log(`Cache hit for ${category} query: ${query}, page: ${page}`);
        return {
          ...cachedData,
          cached: true,
          cacheExpiry: await redisService.getTTL(cacheKey)
        };
      }

      // Cache miss - fetch from API
      console.log(`Cache miss for ${category} query: ${query}, page: ${page} - fetching from API`);
      const apiData = await this.fetchFromNewsAPI(query, page);
      
      // Cache the response for 24 hours
      await redisService.set(cacheKey, {
        ...apiData,
        cached: false
      });

      return {
        ...apiData,
        cached: false
      };

    } catch (error) {
      console.error(`Error in fetch${category}News:`, error);
      
      // If Redis fails, try to fetch from API directly
      if (error instanceof Error && error.message.includes('Redis')) {
        console.log('Redis failed, fetching directly from API');
        return await this.fetchFromNewsAPI(query, page);
      }
      
      throw error;
    }
  }

  /**
   * Fetch top headlines directly from News API
   */
  private static async fetchTopHeadlinesFromAPI(country: string, category: string, pageSize: number): Promise<NewsResponse> {
    const params = new URLSearchParams({
      country: country,
      category: category,
      pageSize: pageSize.toString(),
      apiKey: this.API_KEY!,
      language: 'en'
    });

    const url = `https://newsapi.org/v2/top-headlines?${params.toString()}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as NewsResponse;
      
      if (data.status !== 'ok') {
        throw new Error('News API returned an error status');
      }

      return data;
    } catch (error) {
      console.error('Error fetching top headlines from News API:', error);
      throw new Error('Failed to fetch top headlines from API. Please try again later.');
    }
  }

  /**
   * Fetch news directly from News API
   */
  private static async fetchFromNewsAPI(query: string, page: number = 1): Promise<NewsResponse> {
    // Calculate date for last 24 hours
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const fromDate = yesterday.toISOString().split('T')[0];

    const params = new URLSearchParams({
      q: query,
      from: fromDate,
      sortBy: 'popularity',
      apiKey: this.API_KEY!,
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

      const data = await response.json() as NewsResponse;
      
      if (data.status !== 'ok') {
        throw new Error('News API returned an error status');
      }

      return data;
    } catch (error) {
      console.error('Error fetching from News API:', error);
      throw new Error('Failed to fetch news from API. Please try again later.');
    }
  }

  /**
   * Clear cache for a specific query
   */
  static async clearCache(query: string): Promise<void> {
    try {
      const cacheKey = redisService.generateNewsCacheKey(query);
      await redisService.del(cacheKey);
      console.log(`Cache cleared for query: ${query}`);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  static async getCacheStats(): Promise<{
    totalKeys: number;
    memoryUsage: string;
    hitRate: number;
  }> {
    try {
      // This is a simplified version - you can enhance it based on your needs
      return {
        totalKeys: 0,
        memoryUsage: 'N/A',
        hitRate: 0
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return {
        totalKeys: 0,
        memoryUsage: 'N/A',
        hitRate: 0
      };
    }
  }
}
