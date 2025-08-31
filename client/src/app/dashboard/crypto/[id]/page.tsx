"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import TradingViewChart from "@/components/TradingViewChart";
import { BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NewsSection from "@/components/NewsSection";
import OrderBook from "@/components/OrderBook";
import FearGreedIndex from "@/components/FearGreedIndex";

const fetchCrypto = async () => {
  const res = await fetch("/api/crypto", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch crypto data");
  return res.json();
};

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  ath: number;
  ath_change_percentage: number;
  atl: number;
  atl_change_percentage: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
}

export default function CryptoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ["crypto"],
    queryFn: fetchCrypto,
  });
  
  const coin = data?.find((c: CryptoData) => c.id === id);

  if (isLoading) return (
    <div className="text-center py-12 text-muted-foreground text-lg">
      Loading...
    </div>
  );
  
  if (error || !coin) return (
    <div className="text-center py-12 text-destructive text-lg">
      Coin not found
    </div>
  );

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

  const priceChangeDisplay = getPriceChangeDisplay(coin.price_change_percentage_24h);

  return (
    <div className="w-full mt-8 flex flex-col space-y-6 p-4">
      {/* Header Card */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Image 
              src={coin.image} 
              alt={coin.name} 
              width={64} 
              height={64} 
              className="rounded-full shadow-lg" 
            />
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-foreground uppercase">
                {coin.symbol}
              </h1>
              <span className="text-xl text-muted-foreground italic">
                {coin.name}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-center lg:items-end gap-4">
            <div className="text-center lg:text-right">
              <div className="text-3xl font-bold text-foreground">
                {formatNumber(coin.current_price, 2)}
              </div>
              <div className={`flex items-center gap-2 justify-center lg:justify-end ${priceChangeDisplay.color}`}>
                {priceChangeDisplay.icon}
                <span className="text-lg font-semibold">
                  {coin.price_change_percentage_24h > 0 ? '+' : ''}
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            </div>
            
            <Link href={`/dashboard/crypto/${id}/analytics`}>
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

      {/* Market Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Market Cap & Rank */}
        <Card className="p-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-purple-700 dark:text-purple-400">
              Market Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Market Cap Rank</span>
              <span className="font-semibold text-foreground">#{coin.market_cap_rank}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Market Cap</span>
              <span className="font-semibold text-foreground">
                {formatNumber(coin.market_cap)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Volume (24h)</span>
              <span className="font-semibold text-foreground">
                {formatNumber(coin.total_volume)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 24h High & Low */}
        <Card className="p-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-700 dark:text-green-400">
              24 Hour Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">24h High</span>
              <span className="font-semibold text-green-600">
                {formatNumber(coin.high_24h)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">24h Low</span>
              <span className="font-semibold text-red-600">
                {formatNumber(coin.low_24h)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">24h Change</span>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${priceChangeDisplay.bgColor}`}>
                {priceChangeDisplay.icon}
                <span className={`text-sm font-medium ${priceChangeDisplay.textColor}`}>
                  {coin.price_change_percentage_24h > 0 ? '+' : ''}
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Time High & Low */}
        <Card className="p-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-pink-700 dark:text-pink-400">
              All Time Records
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">All Time High</span>
              <span className="font-semibold text-pink-600">
                {formatNumber(coin.ath)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">ATH Change %</span>
              <span className="font-semibold text-pink-600">
                {coin.ath_change_percentage.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">All Time Low</span>
              <span className="font-semibold text-indigo-600">
                {formatNumber(coin.atl)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">ATL Change %</span>
              <span className="font-semibold text-indigo-600">
                {coin.atl_change_percentage.toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Supply Information */}
        <Card className="p-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-blue-700 dark:text-blue-400">
              Supply Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Circulating Supply</span>
              <span className="font-semibold text-foreground">
                {coin.circulating_supply?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Supply</span>
              <span className="font-semibold text-foreground">
                {coin.total_supply?.toLocaleString() || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Max Supply</span>
              <span className="font-semibold text-foreground">
                {coin.max_supply ? coin.max_supply.toLocaleString() : '-'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart and News Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TradingView Chart */}
        <Card className="p-0 overflow-hidden">
          <CardHeader className="pb-3 px-6 pt-6">
            <CardTitle className="text-lg text-foreground">
              Price Chart
            </CardTitle>
          </CardHeader>
          <TradingViewChart symbol={coin.name} />
        </Card>

        {/* News Section */}
        <NewsSection  coinSymbol={coin.symbol} coinName={coin.name} />
      </div>

      {/* Additional Market Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Order Book */}
        <OrderBook symbol={coin.name} />
        
        {/* Fear & Greed Index */}
        <FearGreedIndex />
      </div>
    </div>
  );
} 