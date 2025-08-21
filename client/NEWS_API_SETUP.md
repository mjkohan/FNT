# News API Setup Guide

## Overview
This application integrates with the News API to fetch cryptocurrency-related news articles. The news section displays the latest 24-hour news related to each cryptocurrency.

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the client directory with your News API key:

```bash
# .env.local
NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key_here
```

### 2. Get Your API Key
1. Visit [NewsAPI.org](https://newsapi.org/)
2. Sign up for a free account
3. Copy your API key from the dashboard
4. Replace `your_news_api_key_here` with your actual API key

### 3. API Limits
- Free tier: 1,000 requests per day
- News from the last 24 hours
- Up to 10 articles per request
- English language only

## Features

### News Section
- **Real-time Updates**: Fetches latest news every 5 minutes
- **Smart Search**: Combines coin name and symbol for relevant results
- **Beautiful UI**: Modern card-based design with images and metadata
- **Error Handling**: Graceful fallbacks for API failures
- **Loading States**: Skeleton loaders while fetching data
- **Refresh Capability**: Manual refresh button for users

### News Cards
- **Article Images**: Displays article thumbnails when available
- **Fallback Icons**: Beautiful placeholder for missing images
- **Meta Information**: Source, author, and publication time
- **External Links**: Direct links to full articles
- **Responsive Design**: Works on all screen sizes

## Technical Implementation

### Architecture
- **Service Layer**: `NewsService` handles API calls and data formatting
- **React Query**: Efficient data fetching with caching and error handling
- **TypeScript**: Full type safety for API responses
- **Component Composition**: Modular, reusable components

### Best Practices
- Environment variable validation
- Proper error handling and user feedback
- Loading states and skeleton loaders
- Responsive design with Tailwind CSS
- Accessibility features (ARIA labels, focus management)
- Performance optimization (caching, debouncing)

## Troubleshooting

### Common Issues
1. **API Key Not Found**: Ensure `.env.local` is in the client directory
2. **Rate Limiting**: Check your daily API quota
3. **No Results**: Verify the search query includes relevant terms
4. **CORS Issues**: News API supports client-side requests

### Debug Mode
Enable console logging by checking the browser console for API responses and errors.

## Security Notes
- API key is exposed to the client (required for News API)
- Consider implementing server-side proxy for production use
- Monitor API usage to prevent abuse
