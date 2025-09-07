'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update?: string;
}

interface FearGreedResponse {
  name: string;
  data: FearGreedData[];
  metadata: {
    error: string | null;
  };
}

export default function FearGreedIndex() {
  const [fearGreedData, setFearGreedData] = useState<FearGreedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchFearGreedIndex = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      const response = await fetch('https://api.alternative.me/fng/?limit=30');
      
      if (!response.ok) {
        throw new Error('Failed to fetch Fear & Greed Index data');
      }
      
      const data: FearGreedResponse = await response.json();
      
      if (data.metadata.error) {
        throw new Error(data.metadata.error);
      }
      
      setFearGreedData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Fear & Greed Index');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFearGreedIndex();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchFearGreedIndex, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getFearGreedColor = (value: number): string => {
    if (value >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (value >= 60) return 'text-green-500 bg-green-100 dark:bg-green-900/20';
    if (value >= 40) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    if (value >= 20) return 'text-orange-600 bg-orange-100 dark:bg-orange-100/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };

  

  const getFearGreedLabel = (value: number): string => {
    if (value >= 80) return 'Extreme Greed';
    if (value >= 60) return 'Greed';
    if (value >= 40) return 'Neutral';
    if (value >= 20) return 'Fear';
    return 'Extreme Fear';
  };

  const formatDate = (timestamp: string): string => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTimeUntilUpdate = (seconds: string): string => {
    const hours = Math.floor(parseInt(seconds) / 3600);
    const minutes = Math.floor((parseInt(seconds) % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground">Fear & Greed Index</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
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
          <CardTitle className="text-lg text-foreground">Fear & Greed Index</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchFearGreedIndex} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!fearGreedData || !fearGreedData.data.length) {
    return null;
  }

  const currentData = fearGreedData.data[0];
  const currentValue = parseInt(currentData.value);
  const historicalData = fearGreedData.data.slice(0, 7); // Last 7 days

  return (
    <Card className="p-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-foreground">Fear & Greed Index</CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`text-xs ${getFearGreedColor(currentValue)}`}
            >
              {getFearGreedLabel(currentValue)}
            </Badge>
            <Button
              onClick={fetchFearGreedIndex}
              variant="ghost"
              size="sm"
              disabled={isRefreshing}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Value */}
        <div className="text-center">
          <div className="text-4xl font-bold mb-2" style={{ color: getFearGreedColor(currentValue).split(' ')[0].replace('text-', '') }}>
            {currentValue}
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            {getFearGreedLabel(currentValue)}
          </div>
          
          {/* Visual Indicator */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${currentValue}%`,
                backgroundColor: currentValue >= 60 ? '#10b981' : currentValue >= 40 ? '#f59e0b' : '#ef4444'
              }}
            />
          </div>
          
          {/* Update Info */}
          {currentData.time_until_update && (
            <div className="text-xs text-muted-foreground">
              Next update in: {getTimeUntilUpdate(currentData.time_until_update)}
            </div>
          )}
        </div>

        {/* Historical Chart */}
        <div>
          <div className="text-sm font-medium text-muted-foreground mb-3">Last 7 Days</div>
          <div className="space-y-2">
            {historicalData.map((day, index) => {
              const value = parseInt(day.value);
              const isToday = index === 0;
              
              return (
                <div key={day.timestamp} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-12">
                      {formatDate(day.timestamp)}
                    </span>
                    {isToday && (
                      <Badge variant="secondary" className="text-xs">
                        Today
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{value}</span>
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${value}%`,
                          backgroundColor: value >= 60 ? '#10b981' : value >= 40 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-16 text-right">
                      {getFearGreedLabel(value)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Market Sentiment */}
        <div className="border-t pt-4">
          <div className="text-sm font-medium text-muted-foreground mb-2">Market Sentiment</div>
          <div className="text-xs text-muted-foreground leading-relaxed">
            {currentValue >= 80 && "Extreme greed suggests the market may be overvalued. Consider taking profits."}
            {currentValue >= 60 && currentValue < 80 && "Greed indicates bullish sentiment. Markets are optimistic."}
            {currentValue >= 40 && currentValue < 60 && "Neutral sentiment suggests balanced market conditions."}
            {currentValue >= 20 && currentValue < 40 && "Fear indicates bearish sentiment. Markets are pessimistic."}
            {currentValue < 20 && "Extreme fear suggests the market may be oversold. Consider buying opportunities."}
          </div>
        </div>

        {/* Last Update */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}
