'use client';

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import TradingViewChart from "@/components/TradingViewChart";
import NewsSection from "@/components/NewsSection";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Brain, 
  Sparkles,
  Bot,
  Zap,
  ArrowLeft,
  ChartLine,
  Newspaper,
  Play
} from "lucide-react";
import Link from "next/link";

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

export default function CryptoAnalyticsPage() {
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
      {/* Back Navigation */}
      <div className="flex items-center gap-2">
        <Link href={`/dashboard/crypto/${id}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to {coin.symbol}
          </Button>
        </Link>
      </div>

      {/* Enhanced Header Card */}
      <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-0 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Image 
                src={coin.image} 
                alt={coin.name} 
                width={80} 
                height={80} 
                className="rounded-full shadow-2xl ring-4 ring-white/20 dark:ring-gray-800/20" 
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2 shadow-lg">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold text-foreground uppercase tracking-wide">
                  {coin.symbol}
                </h1>
                
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">
                    {formatNumber(coin.current_price, 2)}
                  </div>
                  <div className={`flex items-center gap-2 justify-center ${priceChangeDisplay.color}`}>
                    {priceChangeDisplay.icon}
                    <span className="text-lg font-semibold">
                      {coin.price_change_percentage_24h > 0 ? '+' : ''}
                      {coin.price_change_percentage_24h?.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-12" />
                {/* <div className="text-center">
                  <div className="text-sm text-muted-foreground">Market Cap</div>
                  <div className="text-lg font-semibold text-foreground">
                    {formatNumber(coin.market_cap)}
                  </div>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Volume (24h)</div>
                  <div className="text-lg font-semibold text-foreground">
                    {formatNumber(coin.total_volume)}
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center lg:items-end gap-4">
            <div className="text-center lg:text-right">
              <div className="text-sm text-muted-foreground mb-2">All Time High</div>
              <div className="text-xl font-bold text-pink-600">
                {formatNumber(coin.ath)}
              </div>
              <div className="text-sm text-muted-foreground">
                {coin.ath_change_percentage.toFixed(2)}% from ATH
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Chart and News Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TradingView Chart */}
        <Card className="p-0 overflow-hidden">
          <CardHeader className="pb-3 px-6 pt-6">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <ChartLine className="w-5 h-5" />
              Price Chart
            </CardTitle>
          </CardHeader>
          <TradingViewChart symbol={coin.name} />
        </Card>

        {/* News Section */}
        <NewsSection coinName={coin.name} coinSymbol={coin.symbol} />
      </div>

      {/* AI Analysis Section */}
      <Card className="p-8 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-0 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full p-3">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground">
              AI-Powered Analysis
            </CardTitle>
          </div>
          <p className="text-muted-foreground text-lg">
            Get intelligent insights from multiple AI models for {coin.name} analysis
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* AI Model Selection */}
          <div className="space-y-4">
            <div className="text-lg font-semibold text-foreground mb-3">Select AI Model</div>
            <RadioGroup defaultValue="chatgpt" className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex justify-center items-center space-x-2">
                <RadioGroupItem value="chatgpt" id="chatgpt" />
                <Label htmlFor="chatgpt" className="flex items-center gap-2 cursor-pointer">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-2">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">ChatGPT</span>
                </Label>
              </div>
              
              <div className="flex justify-center items-center space-x-2">
                <RadioGroupItem value="gemini" id="gemini" />
                <Label htmlFor="gemini" className="flex items-center gap-2 cursor-pointer">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-2">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Gemini</span>
                </Label>
              </div>
              
              <div className="flex justify-center items-center space-x-2">
                <RadioGroupItem value="claude" id="claude" />
                <Label htmlFor="claude" className="flex items-center gap-2 cursor-pointer">
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-full p-2">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Claude</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Analysis Type Selection */}
          <div className="space-y-4">
            <div className="text-lg font-semibold text-foreground mb-3">Analysis Type</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-center items-center space-x-2">
                <Checkbox id="news-analysis" defaultChecked />
                <Label htmlFor="news-analysis" className="flex items-center gap-2 cursor-pointer">
                  <Newspaper className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">News Analysis</span>
                  <span className="text-sm text-muted-foreground">(Sentiment & Impact)</span>
                </Label>
              </div>
              
              <div className="flex justify-center items-center space-x-2">
                <Checkbox id="chart-analysis" defaultChecked />
                <Label htmlFor="chart-analysis" className="flex items-center gap-2 cursor-pointer">
                  <ChartLine className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Chart Analysis</span>
                  <span className="text-sm text-muted-foreground">(Technical & Patterns)</span>
                </Label>
              </div>
            </div>
          </div>

    
          <div className="text-center pt-6">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Play className="w-5 h-5 mr-2" />
              Start AI Analysis
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Analysis will be generated based on current market data and recent news
            </p>
          </div>
        </CardContent>
      </Card>

     
    </div>
  );
}
