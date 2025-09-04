import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

interface CommoditiesCardProps {
  symbol: string;
  description: string;
  displaySymbol: string;
}

interface CommodityRate {
  exchange: string;
  name: string;
  price: number;
  updated: number;
}

const fetchCommodityRate = async (symbol: string): Promise<CommodityRate> => {
  const res = await fetch(`/api/commodities/rate?symbol=${symbol}`);
  if (!res.ok) throw new Error('Failed to fetch commodity rate');
  return res.json();
};

export default function CommoditiesCard({ symbol, description, displaySymbol }: CommoditiesCardProps) {
  const { data: rate, isLoading, error } = useQuery({
    queryKey: ["commodityRate", symbol],
    queryFn: () => fetchCommodityRate(symbol),
    staleTime: 60000, // 1 minute
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 1, // Only retry once to avoid API rate limits
  });

  const price = rate?.price;
  const exchange = rate?.exchange;

  // Get commodity image path
  const getCommodityImage = (symbol: string) => {
    return `/commodities/${symbol}.png`;
  };

  return (
    <Link href={`/dashboard/commodities/${symbol}`} className="block group focus:outline-none">
      <Card className="flex flex-col items-center justify-center p-6 shadow-lg rounded-2xl bg-card/90 group-hover:scale-105 group-hover:ring-2 group-hover:ring-primary/40 transition-transform duration-200 relative max-h-[300px] min-h-[300px] cursor-pointer">
        {/* Commodity Type Badge */}
        <span className="absolute top-3 left-3 bg-primary/90 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
          {displaySymbol}
        </span>
        
        
        {/* Commodity Name */}
        <span className="text-lg font-semibold text-center text-foreground mb-0.5 line-clamp-2">
          {description}
        </span>
        
        {/* Commodity Image */}
        <div className="w-16 h-16 mb-3 flex items-center justify-center relative">
          <Image 
            src={getCommodityImage(symbol)} 
            alt={description}
            width={64}
            height={64}
            className="w-full h-full object-contain rounded-lg"
            onError={(e) => {
              // Fallback to a simple icon if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          {/* Fallback icon */}
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center text-primary font-bold text-lg hidden">
            {symbol.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <CardContent className="p-0 flex flex-col items-center">
          <span className="text-xs uppercase text-muted-foreground mb-1">{displaySymbol}</span>
          
          {isLoading ? (
            <div className="w-16 h-4 bg-muted rounded animate-pulse mb-1" />
          ) : price ? (
            <span className="text-base font-mono text-foreground">
              ${price.toFixed(2)}
            </span>
          ) : error ? (
            <span className="text-base font-mono text-muted-foreground">N/A</span>
          ) : (
            <span className="text-base font-mono text-muted-foreground">N/A</span>
          )}
          
          {exchange && (
            <span className="text-xs font-medium mt-1 text-muted-foreground">
              {exchange}
            </span>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
