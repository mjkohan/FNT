import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

class RedisService {
  private redis: Redis;
  private readonly TTL_24_HOURS = 24 * 60 * 60; // 24 hours in seconds

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.redis.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    this.redis.on('connect', () => {
      console.log('Connected to Redis');
    });

    this.redis.on('ready', () => {
      console.log('Redis is ready');
    });
  }

  /**
   * Set a key-value pair with TTL
   */
  async set(key: string, value: any, ttl: number = this.TTL_24_HOURS): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.redis.setex(key, ttl, serializedValue);
    } catch (error) {
      console.error('Redis set error:', error);
      throw new Error('Failed to set cache value');
    }
  }

  /**
   * Get a value by key
   */
  async get(key: string): Promise<any | null> {
    try {
      const value = await this.redis.get(key);
      if (value) {
        return JSON.parse(value);
      }
      return null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  /**
   * Check if a key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }

  /**
   * Delete a key
   */
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }

  /**
   * Get TTL for a key
   */
  async getTTL(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key);
    } catch (error) {
      console.error('Redis TTL error:', error);
      return -1;
    }
  }

  /**
   * Generate cache key for news queries
   */
  generateNewsCacheKey(query: string, page: number = 1): string {
    const normalizedQuery = query.toLowerCase().trim().replace(/\s+/g, '_');
    return `news:${normalizedQuery}:page_${page}`;
  }

  /**
   * Close Redis connection
   */
  async close(): Promise<void> {
    try {
      await this.redis.quit();
    } catch (error) {
      console.error('Redis close error:', error);
    }
  }
}

// Export singleton instance
export const redisService = new RedisService();
export default RedisService;
