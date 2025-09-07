import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import BookmarkButton from "@/components/BookmarkButton";

interface StockCardProps {
  symbol: string;
  description: string;
  displaySymbol: string;
  type: string;
  mic: string;
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
}

const fetchStockQuote = async (symbol: string): Promise<StockQuote> => {
  const res = await fetch(`/api/stocks/quote?symbol=${symbol}`);
  if (!res.ok) throw new Error('Failed to fetch stock quote');
  return res.json();
};

const fetchStockLogo = async (symbol: string): Promise<StockLogo> => {
  const res = await fetch(`/api/stocks/logo?symbol=${symbol}`);
  if (!res.ok) throw new Error('Failed to fetch stock logo');
  return res.json();
};

export default function StockCard({ symbol, description, displaySymbol, type, mic, currency }: StockCardProps) {
  const { data: quote, isLoading: quoteLoading, error: quoteError } = useQuery({
    queryKey: ["stockQuote", symbol],
    queryFn: () => fetchStockQuote(symbol),
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // Refetch every 30 seconds
  });

  const { data: logo, isLoading: logoLoading, error: logoError } = useQuery({
    queryKey: ["stockLogo", symbol],
    queryFn: () => fetchStockLogo(symbol),
    staleTime: 36000000, // 1 hour (logos don't change often)
  });

  const loading = quoteLoading || logoLoading;

  const priceChange = quote?.dp || 0;
  const showChange = Math.abs(priceChange) >= 0.01;
  const percentColor = priceChange > 0 ? "text-green-600" : priceChange < 0 ? "text-red-600" : "text-muted-foreground";

  return (
    <div className="block group focus:outline-none relative">
      <Link href={`/dashboard/stocks/${symbol}`} className="block">
        <Card className="flex flex-col items-center justify-center p-6 shadow-lg rounded-2xl bg-card/90 group-hover:scale-105 group-hover:ring-2 group-hover:ring-primary/40 transition-transform duration-200 relative max-h-[300px] min-h-[300px] cursor-pointer">
          {/* Exchange Badge */}
          <span className="absolute top-3 left-3 bg-primary/90 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            {mic}
          </span>
          
          {/* Bookmark Button */}
          <div className="absolute top-3 right-3 z-10">
            <BookmarkButton
              category="stocks"
              symbol={symbol}
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            />
          </div>
        
        {/* Stock Name */}
        <span className="text-lg font-semibold text-center text-foreground mb-0.5 line-clamp-2">
          {description}
        </span>
        
        {/* Logo or Placeholder */}
        {loading ? (
          <div className="w-12 h-12 bg-muted rounded-full mb-3 animate-pulse" />
        ) : logo?.logo ? (
          <Image 
            src={logo.logo} 
            alt={description} 
            width={48} 
            height={48} 
            className="mb-3 rounded-full shadow object-contain bg-white p-1" 
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-3 flex items-center justify-center text-white font-bold text-lg">
            {symbol.charAt(0)}
          </div>
        )}
        
        <CardContent className="p-0 flex flex-col items-center">
          <span className="text-xs uppercase text-muted-foreground mb-1">{displaySymbol}</span>
          
          {loading ? (
            <div className="w-16 h-4 bg-muted rounded animate-pulse mb-1" />
          ) : quote ? (
            <span className="text-base font-mono text-foreground">
              ${quote.c?.toFixed(2) || 'N/A'}
            </span>
          ) : (
            <span className="text-base font-mono text-muted-foreground">N/A</span>
          )}
          
          {loading ? (
            <div className="w-12 h-3 bg-muted rounded animate-pulse mt-1" />
          ) : showChange && quote ? (
            <span className={`text-xs font-medium mt-1 ${percentColor}`}>
              {priceChange > 0 ? "+" : ""}{priceChange.toFixed(2)}%
            </span>
          ) : (
            <span className="text-xs font-medium mt-1 text-muted-foreground">-</span>
          )}
        </CardContent>
        </Card>
      </Link>
    </div>
  );
}
