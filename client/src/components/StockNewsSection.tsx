import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Newspaper, Loader2 } from "lucide-react";
import { NewsService, NewsArticle } from "@/services/newsService";
import NewsCard from "./NewsCard";
import { useState, useEffect } from "react";

interface StockNewsSectionProps {
  stockName: string;
  stockSymbol: string;
  onNewsUpdate?: (news: any[]) => void;
}

export default function StockNewsSection({ stockName, stockSymbol, onNewsUpdate }: StockNewsSectionProps) {
  const [page, setPage] = useState(1);
  const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data: newsData, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["stock-news", stockName, stockSymbol, page],
    queryFn: () => NewsService.fetchStockNews(`${stockName} ${stockSymbol} stock company`, page),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Update articles when new data comes in
  useEffect(() => {
    if (newsData?.articles) {
      if (page === 1) {
        setAllArticles(newsData.articles);
      } else {
        setAllArticles(prev => [...prev, ...newsData.articles]);
      }
      setHasMore(newsData.articles.length === 10); // Assuming 10 articles per page
      
      // Notify parent component about news updates
      if (onNewsUpdate) {
        onNewsUpdate(newsData.articles);
      }
    }
  }, [newsData, page, onNewsUpdate]);

  const handleLoadMore = async () => {
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
      setIsLoadingMore(false);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    setAllArticles([]);
    setHasMore(true);
    refetch();
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            Related News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            Related News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-destructive mb-4">
              Failed to load news. {error instanceof Error ? error.message : 'Please try again later.'}
            </p>
            <Button 
              onClick={handleRefresh} 
              variant="outline"
              disabled={isRefetching}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
              {isRefetching ? 'Refreshing...' : 'Try Again'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!newsData?.articles || allArticles.length === 0) {
    return (
      <Card className="p-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            Related News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              No recent news found for {stockName}
            </p>
            <Button 
              onClick={handleRefresh} 
              variant="outline"
              disabled={isRefetching}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
              {isRefetching ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            Related News
            <span className="text-sm text-muted-foreground font-normal">
              (Last 24h)
            </span>
          </CardTitle>
          <Button 
            onClick={handleRefresh} 
            variant="ghost" 
            size="sm"
            disabled={isRefetching}
            className="h-8 px-2 hover:bg-blue-50 dark:hover:bg-blue-950/20"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-4 px-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
          {allArticles.map((article: NewsArticle, index: number) => (
            <div
              key={`${article.url}-${index}`}
              className="animate-in slide-in-from-bottom-2 duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <NewsCard article={article} />
            </div>
          ))}
        </div>
        
        {/* Load More Section */}
        {hasMore && (
          <div className="mt-6 pt-4 border-t border-border px-6">
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-muted-foreground text-center">
                Showing {allArticles.length} of {newsData?.totalResults || 0} articles
              </p>
              <Button 
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                variant="outline"
                size="sm"
                className="hover:bg-blue-50 dark:hover:bg-blue-950/20"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Articles'
                )}
              </Button>
            </div>
          </div>
        )}
        
        {!hasMore && allArticles.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border px-6">
            <p className="text-sm text-muted-foreground text-center">
              Showing all {allArticles.length} articles
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
