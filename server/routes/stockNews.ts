import { Router } from 'express';
import { redisService } from '../services/redisService';

const router = Router();

// Get stock news for a specific symbol
router.get('/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { from, to } = req.query;

    if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter is required' });
    }

    // Generate cache key
    const cacheKey = `stock_news:${symbol}:${from || 'default'}:${to || 'default'}`;
    
    // Try to get from Redis cache first
    const cachedNews = await redisService.get(cacheKey);
    if (cachedNews) {
      return res.json(cachedNews);
    }

    // If not in cache, fetch from Finnhub API
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const fromDate = from ? from.toString() : yesterday.toISOString().split('T')[0];
    const toDate = to ? to.toString() : today.toISOString().split('T')[0];

    const apiUrl = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${process.env.FINNHUB_API_KEY}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.status}`);
    }

    const newsData = await response.json() as any[];

    // Cache the news data for 24 hours (daily cache)
    await redisService.set(cacheKey, newsData, 86400);

    res.json(newsData);
  } catch (error) {
    console.error('Error fetching stock news:', error);
    res.status(500).json({ error: 'Failed to fetch stock news' });
  }
});

// Get stock news for multiple symbols
router.post('/batch', async (req, res) => {
  try {
    const { symbols, from, to } = req.body;

    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({ error: 'Symbols array is required' });
    }

    const results: { [key: string]: any[] } = {};

    // Process symbols in parallel
    const promises = symbols.map(async (symbol: string) => {
      try {
        const cacheKey = `stock_news:${symbol}:${from || 'default'}:${to || 'default'}`;
        
        // Try cache first
        const cachedNews = await redisService.get(cacheKey);
        if (cachedNews) {
          results[symbol] = cachedNews;
          return;
        }

        // Fetch from API
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const fromDate = from ? from.toString() : yesterday.toISOString().split('T')[0];
        const toDate = to ? to.toString() : today.toISOString().split('T')[0];

        const apiUrl = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${process.env.FINNHUB_API_KEY}`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          console.error(`Failed to fetch news for ${symbol}: ${response.status}`);
          results[symbol] = [];
          return;
        }

        const newsData = await response.json() as any[];
        results[symbol] = newsData;

        // Cache the data
        await redisService.set(cacheKey, newsData, 86400);
      } catch (error) {
        console.error(`Error fetching news for ${symbol}:`, error);
        results[symbol] = [];
      }
    });

    await Promise.all(promises);
    res.json(results);
  } catch (error) {
    console.error('Error in batch stock news fetch:', error);
    res.status(500).json({ error: 'Failed to fetch batch stock news' });
  }
});

export default router;
