'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ExternalLink, Calendar, Globe, RefreshCw } from 'lucide-react';
import Image from 'next/image';

interface NewsArticle {
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

interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
  cached: boolean;
  cacheExpiry?: number;
}

interface CommoditiesNewsSectionProps {
  commodityName: string;
  commoditySymbol: string;
  onNewsUpdate?: (news: NewsArticle[]) => void;
}

export default function CommoditiesNewsSection({ 
  commodityName, 
  commoditySymbol, 
  onNewsUpdate 
}: CommoditiesNewsSectionProps) {
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCommoditiesNews = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create a comprehensive search query for commodities
      const searchQuery = `${commodityName} ${commoditySymbol} commodities trading futures`;
      
      const response = await fetch(`/api/news/commodities?query=${encodeURIComponent(searchQuery)}&page=1`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch commodities news');
      }

      const data = await response.json();
      
      if (data.success && data.data?.articles) {
        setNewsData(data.data.articles);
        setLastUpdated(new Date());
        onNewsUpdate?.(data.data.articles);
      } else {
        throw new Error(data.error || 'Failed to fetch news');
      }
    } catch (err) {
      console.error('Error fetching commodities news:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommoditiesNews();
  }, [commodityName, commoditySymbol]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleRefresh = () => {
    fetchCommoditiesNews();
  };

  if (error) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Commodities News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      <CardHeader className="pb-3 px-6 pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Commodities News - {commoditySymbol}
          </CardTitle>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                Updated {getTimeAgo(lastUpdated.toISOString())}
              </span>
            )}
            <Button 
              onClick={handleRefresh} 
              variant="ghost" 
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading commodities news...</span>
          </div>
        ) : newsData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No commodities news found for {commodityName}
          </div>
        ) : (
          <div className="space-y-4">
            {newsData.slice(0, 5).map((article, index) => (
              <div 
                key={index} 
                className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex gap-4">
                  {article.urlToImage && (
                    <div className="flex-shrink-0">
                      <Image
                        src={article.urlToImage}
                        alt={article.title}
                        width={120}
                        height={80}
                        className="rounded-lg object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="flex-shrink-0"
                      >
                        <a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                    
                    {article.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {article.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <span>{article.source.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      {article.author && (
                        <Badge variant="secondary" className="text-xs">
                          {article.author}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {newsData.length > 5 && (
              <div className="text-center pt-4">
                <Button variant="outline" size="sm">
                  View More News ({newsData.length - 5} more)
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
