# Frontend News API Setup Guide

## Overview
The frontend now uses your backend API instead of calling the News API directly. This provides better caching, rate limiting, and security.

## Environment Configuration

### 1. Update .env.local
Replace your current `.env.local` with:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Remove this line - no longer needed
# NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key_here
```

### 2. Backend Requirements
Make sure your backend server is running with:
- Redis caching enabled
- News API routes configured
- Environment variables set up

## How It Works Now

### Before (Direct News API)
```
Frontend → News API (limited to 1000 calls/day)
```

### After (Backend + Redis)
```
Frontend → Backend → Redis Cache → News API (if needed)
```

## Benefits

### 1. **API Limit Management**
- Backend caches news for 24 hours
- Multiple users can request same news without hitting API limit
- Significant reduction in daily API usage

### 2. **Better Performance**
- Cached responses return instantly
- No external API latency for repeated queries
- Improved user experience

### 3. **Security & Control**
- API key stored securely on backend
- Rate limiting and monitoring capabilities
- Better error handling and logging

## API Endpoints

### Frontend Calls
- `GET /api/news/crypto?query=bitcoin&page=1`
- Automatic caching handled by backend
- Pagination support maintained

### Backend Response Format
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "totalResults": 100,
    "articles": [...],
    "cached": true,
    "cacheExpiry": 86400
  },
  "message": "Data retrieved from cache"
}
```

## Development Workflow

### 1. Start Backend
```bash
# Start all services including Redis
docker-compose -f docker-compose.dev.yml up -d

# Or start just the backend if Redis is already running:
cd server
npm run dev
```

### 2. Start Frontend
```bash
cd client
npm run dev
```

### 3. Test News
- Navigate to any cryptocurrency page
- News will be fetched from backend
- First request: API call + cache
- Subsequent requests: Cache hit

## Monitoring

### Cache Status
Check if news is cached by looking at the response:
- `cached: true` = Retrieved from Redis
- `cached: false` = Fresh from News API

### Backend Logs
Watch server console for:
- Cache hits/misses
- API call logs
- Redis connection status

## Troubleshooting

### Common Issues

1. **Backend Not Running**
   - Error: "Failed to fetch news"
   - Solution: Start backend server

2. **Redis Connection Failed**
   - Backend falls back to direct API calls
   - Check Redis container status

3. **CORS Issues**
   - Ensure backend CORS is configured
   - Check API URL in frontend

### Debug Steps

1. **Check Backend Status**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Test News Endpoint**
   ```bash
   curl "http://localhost:3000/api/news/crypto?query=bitcoin"
   ```

3. **Check Redis**
   ```bash
   docker exec -it redis_dev redis-cli ping
   ```

## Production Deployment

### Environment Variables
```bash
# Production
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api

# Development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Backend Requirements
- Redis instance (managed service recommended)
- News API key configured
- Proper CORS settings for production domain
- Rate limiting and monitoring

## Performance Expectations

### Cache Hit Rate
- **First Day**: 0% (all cache misses)
- **Subsequent Days**: 80-90% cache hits
- **Popular Queries**: 95%+ cache hits

### Response Times
- **Cache Hit**: <50ms
- **Cache Miss**: 200-500ms (API call)
- **Overall Improvement**: 3-5x faster

### API Usage Reduction
- **Without Caching**: 1000 calls/day limit
- **With Caching**: 100-200 calls/day typical
- **Savings**: 80-90% reduction in API usage
