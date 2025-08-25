import express from 'express';
import asyncHandler from 'express-async-handler';
import { z } from 'zod';
import { NewsService } from '../services/newsService';

const router = express.Router();

// Validation schema for news query
const newsQuerySchema = z.object({
  query: z.string().min(1).max(200),
  page: z.coerce.number().int().min(1).max(10).default(1)
});

/**
 * GET /api/news/crypto
 * Fetch cryptocurrency news with caching
 */
router.get('/crypto', asyncHandler(async (req, res) => {
  const { query, page } = newsQuerySchema.parse(req.query);
  
  try {
    const newsData = await NewsService.fetchCryptoNews(query, page);
    
    res.json({
      success: true,
      data: newsData,
      message: newsData.cached ? 'Data retrieved from cache' : 'Data fetched from API'
    });
  } catch (error) {
    console.error('News fetch error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch news'
    });
  }
}));

/**
 * POST /api/news/crypto
 * Fetch cryptocurrency news with POST method (for complex queries)
 */
router.post('/crypto', asyncHandler(async (req, res) => {
  const { query, page } = newsQuerySchema.parse(req.body);
  
  try {
    const newsData = await NewsService.fetchCryptoNews(query, page);
    
    res.json({
      success: true,
      data: newsData,
      message: newsData.cached ? 'Data retrieved from cache' : 'Data fetched from API'
    });
  } catch (error) {
    console.error('News fetch error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch news'
    });
  }
}));

/**
 * DELETE /api/news/cache/:query
 * Clear cache for a specific query
 */
router.delete('/cache/:query', asyncHandler(async (req, res) => {
  const { query } = req.params;
  
  try {
    await NewsService.clearCache(query);
    
    res.json({
      success: true,
      message: `Cache cleared for query: ${query}`
    });
  } catch (error) {
    console.error('Cache clear error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache'
    });
  }
}));

/**
 * GET /api/news/cache/stats
 * Get cache statistics
 */
router.get('/cache/stats', asyncHandler(async (req, res) => {
  try {
    const stats = await NewsService.getCacheStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Cache stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cache statistics'
    });
  }
}));

/**
 * GET /api/news/health
 * Health check for news service
 */
router.get('/health', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'News service is healthy',
    timestamp: new Date().toISOString()
  });
}));

export default router;
