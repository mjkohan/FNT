import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Newspaper, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface StockNewsArticle {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

interface StockNewsSectionProps {
  stockName: string;
  stockSymbol: string;
  onNewsUpdate?: (news: any[]) => void;
}

const fetchStockNews = async (symbol: string): Promise<StockNewsArticle[]> => {
  const res = await fetch(`/api/stock-news?symbol=${symbol}`);
  if (!res.ok) throw new Error('Failed to fetch stock news');
  return res.json();
};

export default function StockNewsSection({ stockName, stockSymbol, onNewsUpdate }: StockNewsSectionProps) {
  const [allArticles, setAllArticles] = useState<StockNewsArticle[]>([]);

  const { data: newsData, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["stock-news", stockSymbol],
    queryFn: () => fetchStockNews(stockSymbol),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
  
  // Update articles when new data comes in
  useEffect(() => {
    if (newsData) {
      setAllArticles(newsData);
      
      // Notify parent component about news updates
      if (onNewsUpdate) {
        onNewsUpdate(newsData);
      }
    }
  }, [newsData, onNewsUpdate]);

  const handleRefresh = () => {
    setAllArticles([]);
    refetch();
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            Company News
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
            Company News
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

  if (!newsData || allArticles.length === 0) {
    return (
      <Card className="p-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            Company News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              No recent news found for {stockName} ({stockSymbol})
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
            Company News
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
          {allArticles.map((article: StockNewsArticle, index: number) => (
            <div
              key={`${article.id}-${index}`}
              className="animate-in slide-in-from-bottom-2 duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <StockNewsCard article={article} />
            </div>
          ))}
        </div>
        
        {allArticles.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border px-6">
            <p className="text-sm text-muted-foreground text-center">
              Showing {allArticles.length} recent articles
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Stock News Card Component
function StockNewsCard({ article }: { article: StockNewsArticle }) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="group cursor-pointer">
      <a 
        href={article.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 hover:bg-muted/30"
      >
        <div className="flex gap-4">
          {/* News Image */}
          <div className="flex-shrink-0">
            {article.image ? (
              <img
                src={article.image}
                alt={article.headline}
                className="w-24 h-24 object-cover rounded-lg bg-muted"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Newspaper className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          
          {/* News Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
              {article.headline}
            </h3>
            
            {article.summary && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {truncateText(article.summary, 150)}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">{article.source}</span>
              <span>{formatDate(article.datetime)}</span>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
