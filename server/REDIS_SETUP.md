# Redis News Caching Setup Guide

## Overview
This server implements Redis caching for the News API to reduce API calls and improve performance. News queries are cached for 24 hours, significantly reducing the daily API limit usage.

## Prerequisites
- Docker and Docker Compose installed
- News API key from [NewsAPI.org](https://newsapi.org/)

## Quick Start

### 1. Start Development Environment
```bash
# Start all services including Redis
docker-compose -f docker-compose.dev.yml up -d

# Check if all services are running
docker ps
```

### 2. Environment Configuration
Create a `.env` file in the server directory:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://postgres:prisma@postgres_db:5432/postgres?schema=public"

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# News API
NEWS_API_KEY=your_news_api_key_here

# Redis Configuration (automatically set by Docker Compose)
# REDIS_HOST=redis (set automatically)
# REDIS_PORT=6379 (set automatically)
# REDIS_PASSWORD= (set automatically)
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Server
```bash
# The server will start automatically with Docker Compose
# Or manually if needed:
npm run dev
```

## API Endpoints

### News Endpoints
- `GET /api/news/crypto?query=bitcoin&page=1` - Fetch crypto news with caching
- `POST /api/news/crypto` - Fetch news with POST method
- `DELETE /api/news/cache/:query` - Clear cache for specific query
- `GET /api/news/cache/stats` - Get cache statistics
- `GET /api/news/health` - Health check

### Example Usage
```bash
# Fetch Bitcoin news
curl "http://localhost:3000/api/news/crypto?query=bitcoin&page=1"

# Fetch Ethereum news with POST
curl -X POST "http://localhost:3000/api/news/crypto" \
  -H "Content-Type: application/json" \
  -d '{"query": "ethereum", "page": 1}'

# Clear cache for Bitcoin
curl -X DELETE "http://localhost:3000/api/news/cache/bitcoin"
```

## How Caching Works

### 1. Cache Hit
- Query exists in Redis
- Data returned immediately
- No API call made
- Response includes `cached: true`

### 2. Cache Miss
- Query not found in Redis
- News API called
- Response cached for 24 hours
- Response includes `cached: false`

### 3. Cache Key Format
```
news:{normalized_query}:page_{page_number}
```
Example: `news:bitcoin_cryptocurrency:page_1`

### 4. TTL (Time To Live)
- Default: 24 hours (86,400 seconds)
- Automatically expires
- Reduces API calls significantly

## Benefits

### Performance
- **Faster Response Times**: Cached data returns in milliseconds
- **Reduced Latency**: No external API calls for repeated queries
- **Better User Experience**: Instant news loading

### Cost Savings
- **API Limit Management**: Reduces daily API quota usage
- **Efficient Resource Usage**: Minimizes external API calls
- **Scalability**: Handles more users with same API limits

### Reliability
- **Fallback Support**: If Redis fails, falls back to direct API calls
- **Error Handling**: Graceful degradation on cache failures
- **Health Monitoring**: Built-in health checks

## Monitoring and Maintenance

### Cache Statistics
```bash
GET /api/news/cache/stats
```

### Redis CLI Commands
```bash
# Connect to Redis
docker exec -it redis_dev redis-cli

# Check all keys
KEYS news:*

# Check TTL for a key
TTL news:bitcoin_cryptocurrency:page_1

# Monitor Redis operations
MONITOR
```

### Cache Management
- **Automatic Expiry**: Keys expire after 24 hours
- **Manual Clear**: Clear specific query caches
- **Memory Management**: Redis handles memory automatically

## Production Considerations

### Redis Configuration
- Use Redis Cloud or managed Redis service
- Configure authentication and SSL
- Set up monitoring and alerts
- Implement backup strategies

### Scaling
- Redis clustering for high availability
- Load balancing for multiple server instances
- Cache warming strategies for popular queries

### Security
- Secure Redis connections
- Implement rate limiting
- Monitor API usage patterns
- Set up alerting for unusual activity

## Troubleshooting

### Common Issues
1. **Redis Connection Failed**: Check if Redis container is running
2. **Cache Not Working**: Verify Redis connection settings
3. **API Errors**: Check News API key and limits
4. **Memory Issues**: Monitor Redis memory usage

### Debug Commands
```bash
# Check Redis logs
docker logs redis_dev

# Check server logs
docker logs server_dev

# Test Redis connection
docker exec -it redis_dev redis-cli ping

# Check all services status
docker-compose -f docker-compose.dev.yml ps
```

## Performance Metrics

### Expected Results
- **Cache Hit Rate**: 80-90% for popular queries
- **Response Time**: <50ms for cached data
- **API Calls**: 70-80% reduction in daily usage
- **Memory Usage**: Minimal impact on Redis

### Monitoring
- Track cache hit/miss ratios
- Monitor API call frequency
- Measure response times
- Watch Redis memory usage
