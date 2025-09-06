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
import Image from "next/image";
import TradingViewChart from "@/components/TradingViewChart";
import StockNewsSection from "@/components/StockNewsSection";
import FearGreedIndex from "@/components/FearGreedIndex";
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
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

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

interface StockQuote {
  c: number; // current price
  d: number; // change
  dp: number; // percent change
  h: number; // high price of the day
  l: number; // low price of the day
  o: number; // open price of the day
  pc: number; // previous close price
  t: number; // timestamp
}

interface StockLogo {
  logo: string;
  name: string;
  ticker: string;
  country: string;
  exchange: string;
  industry: string;
  weburl: string;
  marketCapitalization: number;
  shareOutstanding: number;
}

interface AIAnalysisResult {
  summary: string;
  sentiment: string;
  position: string;
  confidence: string;
}

const INTERVALS = [
  { value: '1m', label: '1 Minute', description: 'Ultra short-term' },
  { value: '5m', label: '5 Minutes', description: 'Very short-term' },
  { value: '15m', label: '15 Minutes', description: 'Short-term' },
  { value: '30m', label: '30 Minutes', description: 'Short-term' },
  { value: '1h', label: '1 Hour', description: 'Medium-term' },
  { value: '4h', label: '4 Hours', description: 'Medium-term' },
  { value: '1d', label: '1 Day', description: 'Long-term' },
  { value: '1w', label: '1 Week', description: 'Very long-term' }
];

export default function StockAnalyticsPage() {
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

  const [newsData, setNewsData] = useState<any[]>([]);
  const [selectedInterval, setSelectedInterval] = useState('1d');
  const [selectedAIModel, setSelectedAIModel] = useState('chatgpt');
  const [analysisTypes, setAnalysisTypes] = useState({ news: true, chart: true });
  const [showAnalysisForm, setShowAnalysisForm] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

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

  // Handle AI analysis
  const handleStartAnalysis = async () => {
    if (!stock || (!analysisTypes.news && !analysisTypes.chart)) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: stock.symbol,
          name: stock.description,
          model: selectedAIModel,
          analysisTypes,
          timeframe: selectedInterval,
          newsData: analysisTypes.news ? newsData : null,
          chartData: analysisTypes.chart ? null : null, // Chart data would be fetched here
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI analysis');
      }

      const result = await response.json();
      setAnalysisResult(result);
      setShowAnalysisForm(false);
    } catch (error) {
      console.error('AI Analysis error:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Failed to get AI analysis');
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

  if (stocksLoading || quoteLoading || logoLoading) return (
    <div className="text-center py-12 text-muted-foreground text-lg">
      Loading...
    </div>
  );
  
  if (stocksError || quoteError || logoError || !stock) return (
    <div className="text-center py-12 text-destructive text-lg">
      Stock not found
    </div>
  );

  const priceChangeDisplay = getPriceChangeDisplay(quote?.dp || 0);

  return (
    <div className="w-full mt-8 flex flex-col space-y-6 p-4">
      {/* Back Navigation */}
      <div className="flex items-center gap-2">
        <Link href={`/dashboard/stocks/${symbol}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to {symbol}
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
                  <div className="text-sm text-muted-foreground">Market Cap</div>
                  <div className="text-lg font-semibold text-foreground">
                    {logo?.marketCapitalization ? formatNumber(logo.marketCapitalization) : 'N/A'}
                  </div>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Day Range</div>
                  <div className="text-lg font-semibold text-foreground">
                    {quote ? `${formatNumber(quote.l, 2)} - ${formatNumber(quote.h, 2)}` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center lg:items-end gap-4">
            <div className="text-center lg:text-right">
              <div className="text-sm text-muted-foreground mb-2">Industry</div>
              <div className="text-xl font-bold text-pink-600">
                {logo?.industry || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">
                {logo?.exchange || 'N/A'}
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
            onNewsUpdate={setNewsData}
          />
        </div>
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
            {showAnalysisForm 
              ? `Get intelligent insights from multiple AI models for ${stock.description} analysis using ${selectedInterval} chart data`
              : `AI analysis completed for ${stock.description} using ${selectedInterval} data`
            }
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Show Analysis Form */}
          {showAnalysisForm && (
            <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
              {/* AI Model Selection */}
              <div className="space-y-4">
                <div className="text-lg font-semibold text-foreground mb-3">Select AI Model</div>
                <RadioGroup 
                  value={selectedAIModel} 
                  onValueChange={setSelectedAIModel}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
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
                      <span className="font-medium">XAi(Grok)</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Analysis Type Selection */}
              <div className="space-y-4">
                <div className="text-lg font-semibold text-foreground mb-3">Analysis Type</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-center items-center space-x-2">
                    <Checkbox 
                      id="news-analysis" 
                      checked={analysisTypes.news}
                      onCheckedChange={() => handleCheckboxChange('news')}
                    />
                    <Label htmlFor="news-analysis" className="flex items-center gap-2 cursor-pointer">
                      <Newspaper className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">News Analysis</span>
                      <span className="text-sm text-muted-foreground">(Sentiment & Impact)</span>
                    </Label>
                  </div>
                  
                  <div className="flex justify-center items-center space-x-2">
                    <Checkbox 
                      id="chart-analysis" 
                      checked={analysisTypes.chart}
                      onCheckedChange={() => handleCheckboxChange('chart')}
                    />
                    <Label htmlFor="chart-analysis" className="flex items-center gap-2 cursor-pointer">
                      <ChartLine className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Chart Analysis</span>
                      <span className="text-sm text-muted-foreground">(Technical & Patterns)</span>
                    </Label>
                  </div>
                </div>
              </div>

              {/* AI Analysis Timeframe Selector */}
              <div className="space-y-3">
                <div className="text-lg font-semibold text-foreground">Analysis Timeframe</div>
                <div className="flex items-center gap-3">
                  <Label htmlFor="ai-timeframe" className="text-sm text-muted-foreground whitespace-nowrap">
                    Timeframe:
                  </Label>
                  <Select value={selectedInterval} onValueChange={setSelectedInterval}>
                    <SelectTrigger id="ai-timeframe" className="w-48">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERVALS.map((interval) => (
                        <SelectItem key={interval.value} value={interval.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{interval.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="text-xs text-muted-foreground">
                    AI will analyze {selectedInterval} data
                  </div>
                </div>
              </div>

              {/* Start Analysis Button */}
              <div className="text-center pt-6">
                <Button 
                  size="lg" 
                  onClick={handleStartAnalysis}
                  disabled={isAnalyzing || (!analysisTypes.news && !analysisTypes.chart)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                <p className="text-sm text-muted-foreground mt-3">
                  Analysis will be generated based on {selectedInterval} chart data and recent news
                </p>
              </div>
            </div>
          )}

          {/* Show Analysis Results */}
          {analysisResult && !showAnalysisForm && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-emerald-200 dark:border-emerald-800 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full p-2">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">AI Analysis Results</h3>
                      <p className="text-sm text-muted-foreground">
                        Generated using {selectedAIModel === "chatgpt" ? "ChatGPT" : 
                                       selectedAIModel === "gemini" ? "Gemini" : "XAi(Grok)"} • {selectedInterval} timeframe
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleRegenerateAnalysis}
                    variant="outline"
                    size="sm"
                    className="gap-2 border-emerald-300 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/20"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Summary Section */}
                  <div className="lg:col-span-2">
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-emerald-600" />
                        Analysis Summary
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {analysisResult.summary}
                      </p>
                    </div>
                  </div>
                  
                  {/* Metrics Section */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-600" />
                        Market Sentiment
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Sentiment:</span>
                        <Badge 
                          variant="outline" 
                          className={`${getSentimentDisplay(analysisResult.sentiment).color} border-current font-medium`}
                        >
                          <div className="flex items-center gap-1">
                            {getSentimentDisplay(analysisResult.sentiment).icon}
                            {analysisResult.sentiment}
                          </div>
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        Trading Position
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Position:</span>
                        <Badge 
                          variant="outline" 
                          className={`${
                            analysisResult.position === 'long' ? 'text-green-600 border-green-600' :
                            analysisResult.position === 'short' ? 'text-red-600 border-red-600' :
                            'text-blue-600 border-blue-600'
                          } font-medium`}
                        >
                          {analysisResult.position}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        Confidence Level
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Confidence:</span>
                        <Badge 
                          variant="outline" 
                          className={`${
                            analysisResult.confidence === 'high' ? 'text-emerald-600 border-emerald-600' :
                            analysisResult.confidence === 'medium' ? 'text-yellow-600 border-yellow-600' :
                            'text-orange-600 border-orange-600'
                          } font-medium`}
                        >
                          {analysisResult.confidence}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Error */}
          {analysisError && (
            <div className="animate-in slide-in-from-top-4 duration-500">
              <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">Analysis Failed</h3>
                </div>
                <p className="text-sm text-red-600 dark:text-red-300">
                  {analysisError}
                </p>
                <Button 
                  onClick={handleStartAnalysis}
                  variant="outline"
                  size="sm"
                  className="mt-3 border-red-300 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Market Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Fear & Greed Index */}
        <FearGreedIndex />
        
        {/* Company Information */}
        {logo && (
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Company Name</div>
                  <div className="font-semibold">{logo.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Industry</div>
                  <div className="font-semibold">{logo.industry || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Exchange</div>
                  <div className="font-semibold">{logo.exchange}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Country</div>
                  <div className="font-semibold">{logo.country}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}