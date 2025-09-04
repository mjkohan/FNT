'use client';

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
  const res = await fetch(`/api/commodities/chart-data?name=${symbol}&interval=1h`);
  if (!res.ok) throw new Error('Failed to fetch commodity chart data');
  return res.json();
};

interface CommodityData {
  symbol: string;
  description: string;
  displaySymbol: string;
}

export default function CommodityAnalyticsPage() {
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
  const commodityName = rate?.name || commodity?.description;
  
  // Get commodity image path
  const getCommodityImage = (symbol: string) => {
    return `/commodities/${symbol}.png`;
  };

  // Calculate some basic analytics from the chart data
  const calculateAnalytics = () => {
    if (!chartData || !Array.isArray(chartData)) return null;

    const prices = chartData.map((candle: any) => parseFloat(candle.close));
    const sortedPrices = [...prices].sort((a, b) => a - b);
    
    const currentPrice = price || 0;
    const highestPrice = Math.max(...prices);
    const lowestPrice = Math.min(...prices);
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    
    // Calculate volatility (standard deviation)
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - averagePrice, 2), 0) / prices.length;
    const volatility = Math.sqrt(variance);
    
    // Calculate price change from average
    const priceChangeFromAvg = averagePrice > 0 ? ((currentPrice - averagePrice) / averagePrice) * 100 : 0;

    return {
      currentPrice,
      highestPrice,
      lowestPrice,
      averagePrice,
      volatility,
      priceChangeFromAvg,
      dataPoints: prices.length
    };
  };

  const analytics = calculateAnalytics();

  return (
    <div className="w-full mt-8 flex flex-col space-y-6 p-4">
      {/* Back Navigation */}
      <div className="flex items-center gap-2">
        <Link href={`/dashboard/commodities/${symbol}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to {commodity.displaySymbol}
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full shadow-lg ring-4 ring-white/20 dark:ring-gray-800/20 flex items-center justify-center overflow-hidden">
            <Image 
              src={getCommodityImage(commodity.symbol)} 
              alt={commodity.description}
              width={64}
              height={64}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            {/* Fallback icon */}
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-bold text-xl hidden">
              {commodity.symbol.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Analytics - {commodity.displaySymbol}
            </h1>
            <p className="text-muted-foreground">
              Detailed analysis and statistics for {commodityName}
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Current Price */}
          <Card className="p-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Current Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                ${analytics.currentPrice.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Real-time price
              </div>
            </CardContent>
          </Card>

          {/* Highest Price */}
          <Card className="p-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Highest Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                ${analytics.highestPrice.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Period high
              </div>
            </CardContent>
          </Card>

          {/* Lowest Price */}
          <Card className="p-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                Lowest Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                ${analytics.lowestPrice.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Period low
              </div>
            </CardContent>
          </Card>

          {/* Average Price */}
          <Card className="p-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Average Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                ${analytics.averagePrice.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Period average
              </div>
            </CardContent>
          </Card>

          {/* Volatility */}
          <Card className="p-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                Volatility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                ${analytics.volatility.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Standard deviation
              </div>
            </CardContent>
          </Card>

          {/* Price Change from Average */}
          <Card className="p-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className={`w-5 h-5 ${analytics.priceChangeFromAvg >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                vs Average
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${analytics.priceChangeFromAvg >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics.priceChangeFromAvg >= 0 ? '+' : ''}{analytics.priceChangeFromAvg.toFixed(2)}%
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                From period average
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Information */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Data Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Commodity Name</div>
            <div className="font-semibold">{commodityName}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Symbol</div>
            <div className="font-semibold">{commodity.symbol}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Exchange</div>
            <div className="font-semibold">{exchange || 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Current Price</div>
            <div className="font-semibold">${price?.toFixed(2) || 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Data Points</div>
            <div className="font-semibold">{analytics?.dataPoints || 0}</div>
          </div>
        </CardContent>
      </Card>

      {/* Back to Detail Page */}
      <div className="text-center">
        <Link href={`/dashboard/commodities/${symbol}`}>
          <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Detail View
          </Button>
        </Link>
      </div>
    </div>
  );
}
