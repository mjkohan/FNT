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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TradingViewChart from "@/components/TradingViewChart";
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
  Play,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  RefreshCw,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const fetchCommodities = async () => {
  const res = await fetch("/api/commodities", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch commodities data");
  return res.json();
};

const fetchCommodityQuote = async (symbol: string) => {
  const res = await fetch(`/api/commodities/chart-data?symbol=${symbol}`);
  if (!res.ok) throw new Error('Failed to fetch commodity quote');
  return res.json();
};

interface CommodityData {
  name: string;
  symbol: string;
  description: string;
  displaySymbol: string;
  tvSymbol: string;
}

interface CommodityQuote {
  symbol: string;
  name: string;
  price: number;
  changePercentage: number;
  change: number;
  volume: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  priceAvg50: number;
  priceAvg200: number;
  exchange: string;
  open: number;
  previousClose: number;
  timestamp: number;
}

interface AIAnalysisResult {
  summary: string;
  sentiment: string;
  position: string;
  confidence: string;
}

export default function CommodityAnalyticsPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const { data: commoditiesData, isLoading: commoditiesLoading, error: commoditiesError } = useQuery({
    queryKey: ["commodities"],
    queryFn: fetchCommodities,
  });
  
  const commodity = commoditiesData?.find((c: CommodityData) => c.symbol === symbol);
  
  const { data: quoteData, isLoading: quoteLoading, error: quoteError } = useQuery({
    queryKey: ["commodityQuote", commodity?.symbol],
    queryFn: () => fetchCommodityQuote(commodity?.symbol || ''),
    enabled: !!commodity?.symbol,
  });

  // State management
  const [selectedAIModel, setSelectedAIModel] = useState("chatgpt");
  const [analysisTypes, setAnalysisTypes] = useState({
    news: true,
    chart: true
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [newsData, setNewsData] = useState<any[]>([]);
  const [showAnalysisForm, setShowAnalysisForm] = useState(true);

  if (commoditiesLoading || quoteLoading) return (
    <div className="text-center py-12 text-muted-foreground text-lg">
      Loading...
    </div>
  );
  
  if (commoditiesError || quoteError || !commodity) return (
    <div className="text-center py-12 text-destructive text-lg">
      Commodity not found
    </div>
  );

  const quote = quoteData?.[0]; // API returns array, get first item
  const price = quote?.price;
  const changePercentage = quote?.changePercentage;
  const change = quote?.change;
  const volume = quote?.volume;
  const dayLow = quote?.dayLow;
  const dayHigh = quote?.dayHigh;
  const yearHigh = quote?.yearHigh;
  const yearLow = quote?.yearLow;
  const priceAvg50 = quote?.priceAvg50;
  const priceAvg200 = quote?.priceAvg200;
  const exchange = quote?.exchange;
  const open = quote?.open;
  const previousClose = quote?.previousClose;
  const commodityName = quote?.name || commodity?.description;
  
  // Get commodity image path
  const getCommodityImage = (name: string) => {
    return `/commodities/${name}.png`;
  };

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

  // Handle AI Analysis
  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      // Prepare analysis data with chart data and news
      const analysisData = {
        aiModel: selectedAIModel === "chatgpt" ? "ChatGPT" : 
                 selectedAIModel === "gemini" ? "Gemini" : "Claude",
        analysisTypes: Object.keys(analysisTypes).filter(key => analysisTypes[key as keyof typeof analysisTypes]),
        chartData: quote, // Using quote data as chart data for commodities
        symbol: symbol,
        newsData: {
          commodityName: commodity?.description,
          symbol: symbol,
          timestamp: new Date().toISOString(),
          recentNews: newsData
        }
      };

      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisData),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI analysis');
      }

      const data = await response.json();
      
      setAnalysisResult(data.analysis);
      setShowAnalysisForm(false); // Hide form after successful analysis
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle regenerate analysis
  const handleRegenerateAnalysis = () => {
    setShowAnalysisForm(true);
    setAnalysisResult(null);
    setAnalysisError(null);
  };

  // Handle checkbox changes
  const handleCheckboxChange = (type: 'news' | 'chart') => {
    setAnalysisTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Get sentiment icon and color
  const getSentimentDisplay = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'bullish':
        return { icon: <TrendingUp className="w-4 h-4" />, color: 'text-green-600' };
      case 'bearish':
        return { icon: <TrendingDown className="w-4 h-4" />, color: 'text-red-600' };
      default:
        return { icon: <Minus className="w-4 h-4" />, color: 'text-yellow-600' };
    }
  };


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
              src={getCommodityImage(commodity.name)} 
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
              AI-powered analysis for {commodityName}
            </p>
          </div>
        </div>
      </div>

      {/* Price Overview */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">
                {price ? formatNumber(price) : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Current Price</div>
              {changePercentage !== undefined && (
                <div className={`text-sm font-medium mt-1 ${changePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {changePercentage >= 0 ? '+' : ''}{changePercentage.toFixed(2)}% ({change >= 0 ? '+' : ''}${change.toFixed(2)})
                </div>
              )}
            </div>
            <Separator orientation="vertical" className="h-16" />
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Day Range</div>
              <div className="text-lg font-semibold text-foreground">
                {dayLow && dayHigh ? `${formatNumber(dayLow)} - ${formatNumber(dayHigh)}` : 'N/A'}
              </div>
            </div>
            <Separator orientation="vertical" className="h-16" />
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Volume</div>
              <div className="text-lg font-semibold text-foreground">
                {volume ? volume.toLocaleString() : 'N/A'}
              </div>
            </div>
          </div>
          <div className="text-center lg:text-right">
            <div className="text-sm text-muted-foreground mb-2">Exchange</div>
            <div className="text-sm font-semibold text-foreground">
              {exchange || 'N/A'}
            </div>
          </div>
        </div>
      </Card>

      {/* AI Analysis Section */}
      {showAnalysisForm && (
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              AI Analysis Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label className="text-base font-semibold">AI Model</Label>
                <RadioGroup value={selectedAIModel} onValueChange={setSelectedAIModel}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="chatgpt" id="chatgpt" />
                    <Label htmlFor="chatgpt" className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      ChatGPT
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gemini" id="gemini" />
                    <Label htmlFor="gemini" className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Gemini
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="claude" id="claude" />
                    <Label htmlFor="claude" className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Claude
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-4">
                <Label className="text-base font-semibold">Analysis Types</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="news" 
                      checked={analysisTypes.news}
                      onCheckedChange={() => handleCheckboxChange('news')}
                    />
                    <Label htmlFor="news" className="flex items-center gap-2">
                      <Newspaper className="w-4 h-4" />
                      News Analysis
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="chart" 
                      checked={analysisTypes.chart}
                      onCheckedChange={() => handleCheckboxChange('chart')}
                    />
                    <Label htmlFor="chart" className="flex items-center gap-2">
                      <ChartLine className="w-4 h-4" />
                      Chart Analysis
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleStartAnalysis} 
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start AI Analysis
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <Card className="p-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                AI Analysis Results
              </CardTitle>
              <Button 
                variant="outline" 
                onClick={handleRegenerateAnalysis}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Sentiment</div>
                <div className={`flex items-center justify-center gap-2 text-lg font-semibold ${getSentimentDisplay(analysisResult.sentiment).color}`}>
                  {getSentimentDisplay(analysisResult.sentiment).icon}
                  {analysisResult.sentiment}
                </div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Position</div>
                <div className="text-lg font-semibold">{analysisResult.position}</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Confidence</div>
                <div className="text-lg font-semibold">{analysisResult.confidence}</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold mb-2">Analysis Summary</h4>
                <p className="text-muted-foreground leading-relaxed">{analysisResult.summary}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {analysisError && (
        <Card className="p-6 border-red-200 bg-red-50 dark:bg-red-950/20">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Analysis Error</span>
          </div>
          <p className="text-red-600 mt-2">{analysisError}</p>
        </Card>
      )}

      {/* Chart Section */}
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              52-Week High
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {yearHigh ? formatNumber(yearHigh) : 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              52-Week Low
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {yearLow ? formatNumber(yearLow) : 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              50-Day Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {priceAvg50 ? formatNumber(priceAvg50) : 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-600" />
              200-Day Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {priceAvg200 ? formatNumber(priceAvg200) : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
