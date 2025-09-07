'use client';

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import TradingViewChart from "@/components/TradingViewChart";
import StockNewsSection from "@/components/StockNewsSection";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ArrowLeft,
  ChartLine,
  Building2,
  Globe
} from "lucide-react";
import Link from "next/link";

const fetchStocks = async () => {
  const res = await fetch("/api/stocks", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch stocks data");
  return res.json();
};

const fetchStockQuote = async (symbol: string) => {
  const res = await fetch(`/api/stocks/quote?symbol=${symbol}`);
  if (!res.ok) throw new Error("Failed to fetch stock quote");
  return res.json();
};

const fetchStockLogo = async (symbol: string) => {
  const res = await fetch(`/api/stocks/logo?symbol=${symbol}`);
  if (!res.ok) throw new Error("Failed to fetch stock logo");
  return res.json();
};

interface StockData {
  symbol: string;
  description: string;
  displaySymbol: string;
  type: string;
  mic: string;
  figi: string;
  currency: string;
}


export default function StockPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const { data: stocksData, isLoading: stocksLoading, error: stocksError } = useQuery({
    queryKey: ["stocks"],
    queryFn: fetchStocks,
  });
  
  const { data: quote, isLoading: quoteLoading, error: quoteError } = useQuery({
    queryKey: ["stockQuote", symbol],
    queryFn: () => fetchStockQuote(symbol),
    enabled: !!symbol,
  });

  const { data: logo, isLoading: logoLoading, error: logoError } = useQuery({
    queryKey: ["stockLogo", symbol],
    queryFn: () => fetchStockLogo(symbol),
    enabled: !!symbol,
  });


  const stock = stocksData?.find((s: StockData) => s.symbol === symbol);

  // Helper function to format numbers
  const formatNumber = (num: number, decimals: number = 2) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`;
    return `$${num.toFixed(decimals)}`;
  };

  // Helper function to get price change icon and color
  const getPriceChangeDisplay = (change: number) => {
    if (change > 0) {
      return {
        icon: <TrendingUp className="w-4 h-4" />,
        color: "text-green-600",
        bgColor: "bg-green-100 dark:bg-green-900/20",
        textColor: "text-green-700 dark:text-green-400"
      };
    } else if (change < 0) {
      return {
        icon: <TrendingDown className="w-4 h-4" />,
        color: "text-red-600",
        bgColor: "bg-red-100 dark:bg-red-900/20",
        textColor: "text-red-700 dark:text-red-400"
      };
    } else {
      return {
        icon: <Minus className="w-4 h-4" />,
        color: "text-gray-600",
        bgColor: "bg-gray-100 dark:bg-gray-800",
        textColor: "text-gray-700 dark:text-gray-400"
      };
    }
  };

  if (stocksLoading || quoteLoading || logoLoading) return (
    <div className="text-center py-12 text-muted-foreground text-lg">
      Loading...
    </div>
  );
  
  if (stocksError || quoteError || logoError || !stock) return (
    <div className="text-center py-12 text-destructive text-lg">
      Stock not found or not in popular tickers list
    </div>
  );

  const priceChangeDisplay = getPriceChangeDisplay(quote?.dp || 0);

  return (
    <div className="w-full mt-8 flex flex-col space-y-6 p-4">
      {/* Back Navigation */}
      <div className="flex items-center gap-2">
        <Link href="/dashboard/stocks">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Stocks
          </Button>
        </Link>
      </div>

      {/* Enhanced Header Card */}
      <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-0 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              {logo?.logo ? (
                <Image 
                  src={logo.logo} 
                  alt={stock.description} 
                  width={80} 
                  height={80} 
                  className="rounded-full shadow-2xl ring-4 ring-white/20 dark:ring-gray-800/20 object-contain bg-white p-2" 
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-2xl ring-4 ring-white/20 dark:ring-gray-800/20 flex items-center justify-center text-white font-bold text-2xl">
                  {symbol.charAt(0)}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2 shadow-lg">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold text-foreground uppercase tracking-wide">
                  {symbol}
                </h1>
                <Badge variant="outline" className="text-xs">
                  {stock.mic}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">
                    {quote ? formatNumber(quote.c, 2) : 'N/A'}
                  </div>
                  <div className={`flex items-center gap-2 justify-center ${priceChangeDisplay.color}`}>
                    {priceChangeDisplay.icon}
                    <span className="text-lg font-semibold">
                      {quote?.dp ? (quote.dp > 0 ? '+' : '') + quote.dp.toFixed(2) + '%' : 'N/A'}
                    </span>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Day High</div>
                  <div className="text-lg font-semibold text-foreground">
                    {quote ? formatNumber(quote.h, 2) : 'N/A'}
                  </div>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Day Low</div>
                  <div className="text-lg font-semibold text-foreground">
                    {quote ? formatNumber(quote.l, 2) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center lg:items-end gap-4">
            {logo && (
              <div className="text-center lg:text-right">
                <div className="text-sm text-muted-foreground mb-2">Market Cap</div>
                <div className="text-xl font-bold text-pink-600">
                  {logo.marketCapitalization ? formatNumber(logo.marketCapitalization) : 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {logo.industry || 'N/A'}
                </div>
              </div>
            )}
            
            <Link href={`/dashboard/stocks/${symbol}/analytics`}>
              <Button
                variant="outline"
                size="lg"
                className="bg-gradient-to-r text-white hover:text-white cursor-pointer from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Chart and News Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TradingView Chart */}
        <Card className="p-0 overflow-hidden">
          <CardHeader className="pb-3 px-6 pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <ChartLine className="w-5 h-5" />
                Price Chart 
              </CardTitle>
            </div>
          </CardHeader>
          <TradingViewChart symbol={symbol} />
        </Card>

        {/* News Section */}
        <div className="space-y-4">
          <StockNewsSection 
            stockName={stock.description} 
            stockSymbol={symbol}
          />
        </div>
      </div>

      {/* Company Information */}
      {logo && (
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Company Name</div>
              <div className="font-semibold">{logo.name}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Industry</div>
              <div className="font-semibold">{logo.industry || 'N/A'}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Exchange</div>
              <div className="font-semibold">{logo.exchange}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Country</div>
              <div className="font-semibold">{logo.country}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Shares Outstanding</div>
              <div className="font-semibold">
                {logo.shareOutstanding ? formatNumber(logo.shareOutstanding, 0) : 'N/A'}
              </div>
            </div>
            {logo.weburl && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Website</div>
                <a 
                  href={logo.weburl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Globe className="w-4 h-4" />
                  Visit Website
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

    </div>
  );
}
