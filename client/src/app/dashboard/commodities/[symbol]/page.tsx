'use client';

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import TradingViewChart from "@/components/TradingViewChart";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ArrowLeft,
  ChartLine,
  Globe,
  Calendar,
  DollarSign,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const fetchCommodities = async () => {
  const res = await fetch("/api/commodities", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch commodities data");
  return res.json();
};

const fetchCommodityRate = async (symbol: string) => {
  const res = await fetch(`/api/commodities/rate?symbol=${symbol}`);
  if (!res.ok) throw new Error('Failed to fetch commodity rate');
  return res.json();
};

const fetchCommodityChartData = async (symbol: string) => {
  const res = await fetch(`/api/commodities/chart-data?symbol=${symbol}&interval=1h`);
  if (!res.ok) throw new Error('Failed to fetch commodity chart data');
  return res.json();
};

interface CommodityData {
  symbol: string;
  description: string;
  displaySymbol: string;
  tvSymbol: string;
}

interface CommodityRate {
  exchange: string;
  name: string;
  price: number;
  updated: number;
}

export default function CommodityPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const { data: commoditiesData, isLoading: commoditiesLoading, error: commoditiesError } = useQuery({
    queryKey: ["commodities"],
    queryFn: fetchCommodities,
  });
  
  const commodity = commoditiesData?.find((c: CommodityData) => c.symbol === symbol);
  
  const { data: rate, isLoading: rateLoading, error: rateError } = useQuery({
    queryKey: ["commodityRate", commodity?.symbol],
    queryFn: () => fetchCommodityRate(commodity?.symbol || ''),
    enabled: !!commodity?.symbol,
  });

  const { data: chartData, isLoading: chartLoading, error: chartError } = useQuery({
    queryKey: ["commodityChart", commodity?.symbol],
    queryFn: () => fetchCommodityChartData(commodity?.symbol || ''),
    enabled: !!commodity?.symbol,
  });

  // Helper function to format numbers
  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toFixed(decimals);
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

  // Get commodity image path
  const getCommodityImage = (symbol: string) => {
    return `/commodities/${symbol}.png`;
  };

  if (commoditiesLoading || rateLoading || chartLoading) return (
    <div className="text-center py-12 text-muted-foreground text-lg">
      Loading...
    </div>
  );
  
  if (commoditiesError || rateError || chartError || !commodity) return (
    <div className="text-center py-12 text-destructive text-lg">
      Commodity not found
    </div>
  );

  const price = rate?.price;
  const exchange = rate?.exchange;
  const lastRefreshed = rate?.updated;
  const commodityName = rate?.name || commodity.description;

  return (
    <div className="w-full mt-8 flex flex-col space-y-6 p-4">
      {/* Back Navigation */}
      <div className="flex items-center gap-2">
        <Link href="/dashboard/commodities">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Commodities
          </Button>
        </Link>
      </div>

      {/* Enhanced Header Card */}
      <Card className="p-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-0 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full shadow-2xl ring-4 ring-white/20 dark:ring-gray-800/20 flex items-center justify-center overflow-hidden">
                  <Image 
                    src={getCommodityImage(commodity.symbol)} 
                    alt={commodity.description}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  {/* Fallback icon */}
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-bold text-2xl hidden">
                    {commodity.symbol.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full p-2 shadow-lg">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
              </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold text-foreground uppercase tracking-wide">
                  {commodity.displaySymbol}
                </h1>
                <Badge variant="outline" className="text-xs">
                  COMMODITY
                </Badge>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">
                    {price ? `$${formatNumber(price, 2)}` : 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Current Price
                  </div>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Exchange</div>
                  <div className="text-lg font-semibold text-foreground">
                    {exchange || 'N/A'}
                  </div>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Last Updated</div>
                  <div className="text-lg font-semibold text-foreground">
                    {lastRefreshed ? new Date(lastRefreshed * 1000).toLocaleTimeString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center lg:items-end gap-4">
            <div className="text-center lg:text-right">
              <div className="text-sm text-muted-foreground mb-2">Commodity Name</div>
              <div className="text-sm font-semibold text-foreground">
                {commodityName}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Chart Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* TradingView Chart */}
        <Card className="p-0 overflow-hidden">
          <CardHeader className="pb-3 px-6 pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <ChartLine className="w-5 h-5" />
                Price Chart - {commodity.displaySymbol}
              </CardTitle>
            </div>
          </CardHeader>
          <TradingViewChart symbol={commodity.tvSymbol} />
        </Card>
      </div>

      {/* Commodity Information */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Commodity Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Symbol</div>
            <div className="font-semibold">{commodity.symbol}</div>
            <div className="text-sm text-muted-foreground">
              {commodity.displaySymbol}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Exchange</div>
            <div className="font-semibold">{exchange || 'N/A'}</div>
            <div className="text-sm text-muted-foreground">
              Trading Exchange
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Description</div>
            <div className="font-semibold">{commodity.description}</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Current Price</div>
            <div className="font-semibold text-lg">
              {price ? `$${formatNumber(price, 2)}` : 'N/A'}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Last Updated</div>
            <div className="font-semibold">
              {lastRefreshed ? new Date(lastRefreshed * 1000).toLocaleString() : 'N/A'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Button */}
      <div className="text-center">
        <Link href={`/dashboard/commodities/${symbol}/analytics`}>
          <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <BarChart3 className="w-5 h-5 mr-2" />
            View Analytics
          </Button>
        </Link>
      </div>
    </div>
  );
}
