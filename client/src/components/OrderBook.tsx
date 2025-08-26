'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderBookEntry {
  price: string;
  quantity: string;
}

interface OrderBookData {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

interface OrderBookProps {
  symbol: string;
}

export default function OrderBook({ symbol }: OrderBookProps) {
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrderBook = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      // Convert symbol to Binance format (e.g., "Bitcoin" -> "BTCUSDT")
      const binanceSymbol = getBinanceSymbol(symbol);
      const response = await fetch(`https://api.binance.com/api/v3/depth?symbol=${binanceSymbol}&limit=100`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch order book data');
      }
      
      const data: OrderBookData = await response.json();
      setOrderBook(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order book');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrderBook();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchOrderBook, 30000);
    return () => clearInterval(interval);
  }, [symbol]);

  const getBinanceSymbol = (coinName: string): string => {
    // Map common coin names to Binance symbols
    const symbolMap: { [key: string]: string } = {
      'Bitcoin': 'BTCUSDT',
      'Ethereum': 'ETHUSDT',
      'BNB': 'BNBUSDT',
      'Solana': 'SOLUSDT',
      'Cardano': 'ADAUSDT',
      'XRP': 'XRPUSDT',
      'Polkadot': 'DOTUSDT',
      'Dogecoin': 'DOGEUSDT',
      'Avalanche': 'AVAXUSDT',
      'Chainlink': 'LINKUSDT',
      'Polygon': 'MATICUSDT',
      'Litecoin': 'LTCUSDT',
      'Uniswap': 'UNIUSDT',
      'Bitcoin Cash': 'BCHUSDT',
      'Stellar': 'XLMUSDT',
    };
    
    return symbolMap[coinName] || 'BTCUSDT';
  };

  const formatPrice = (price: string): string => {
    const numPrice = parseFloat(price);
    if (numPrice >= 1) {
      return numPrice.toFixed(2);
    } else if (numPrice >= 0.01) {
      return numPrice.toFixed(4);
    } else {
      return numPrice.toFixed(8);
    }
  };

  const formatQuantity = (quantity: string): string => {
    const numQuantity = parseFloat(quantity);
    if (numQuantity >= 1000) {
      return (numQuantity / 1000).toFixed(2) + 'K';
    } else if (numQuantity >= 1) {
      return numQuantity.toFixed(2);
    } else {
      return numQuantity.toFixed(4);
    }
  };

  const calculateTotal = (entries: [string, string][], index: number): number => {
    let total = 0;
    for (let i = 0; i <= index; i++) {
      total += parseFloat(entries[i][1]);
    }
    return total;
  };

  const getMaxTotal = (entries: [string, string][]): number => {
    return calculateTotal(entries, entries.length - 1);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground">Order Book</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
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
          <CardTitle className="text-lg text-foreground">Order Book</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchOrderBook} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!orderBook) {
    return null;
  }

  const maxBidTotal = getMaxTotal(orderBook.bids);
  const maxAskTotal = getMaxTotal(orderBook.asks);

  return (
    <Card className="p-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-foreground">Order Book</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {getBinanceSymbol(symbol)}
            </Badge>
            <Button
              onClick={fetchOrderBook}
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
      <CardContent className="space-y-4">
        {/* Headers */}
        <div className="grid grid-cols-3 gap-4 text-xs font-medium text-muted-foreground border-b pb-2">
          <span>Price (USDT)</span>
          <span>Amount</span>
          <span>Total</span>
        </div>

        {/* Asks (Sell Orders) - Red */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-red-600 mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Asks (Sell)
          </div>
          {orderBook.asks.slice(0, 10).map((ask, index) => {
            const price = parseFloat(ask[0]);
            const quantity = parseFloat(ask[1]);
            const total = calculateTotal(orderBook.asks, index);
            const percentage = (total / maxAskTotal) * 100;
            
            return (
              <div
                key={`ask-${index}`}
                className="grid grid-cols-3 gap-4 text-sm relative group hover:bg-muted/50 rounded px-2 py-1 transition-colors"
              >
                <span className="text-red-600 font-medium">{formatPrice(ask[0])}</span>
                <span className="text-foreground">{formatQuantity(ask[1])}</span>
                <span className="text-foreground">{formatQuantity(total.toString())}</span>
                <div
                  className="absolute right-0 top-0 bottom-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Spread */}
        {orderBook.bids.length > 0 && orderBook.asks.length > 0 && (
          <div className="border-t border-b py-2 text-center">
            <div className="text-xs text-muted-foreground mb-1">Spread</div>
            <div className="text-sm font-medium text-foreground">
              {((parseFloat(orderBook.asks[0][0]) - parseFloat(orderBook.bids[0][0])) / parseFloat(orderBook.bids[0][0]) * 100).toFixed(2)}%
            </div>
          </div>
        )}

        {/* Bids (Buy Orders) - Green */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-green-600 mb-2 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            Bids (Buy)
          </div>
          {orderBook.bids.slice(0, 10).map((bid, index) => {
            const price = parseFloat(bid[0]);
            const quantity = parseFloat(bid[1]);
            const total = calculateTotal(orderBook.bids, index);
            const percentage = (total / maxBidTotal) * 100;
            
            return (
              <div
                key={`bid-${index}`}
                className="grid grid-cols-3 gap-4 text-sm relative group hover:bg-muted/50 rounded px-2 py-1 transition-colors"
              >
                <span className="text-green-600 font-medium">{formatPrice(bid[0])}</span>
                <span className="text-foreground">{formatQuantity(bid[1])}</span>
                <span className="text-foreground">{formatQuantity(total.toString())}</span>
                <div
                  className="absolute right-0 top-0 bottom-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Last Update */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}
