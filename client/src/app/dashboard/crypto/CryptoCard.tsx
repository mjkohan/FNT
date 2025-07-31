import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface CryptoCardProps {
  name: string;
  image: string;
  price: number;
  priceChange: number;
  marketCapRank: number;
  symbol: string;
  id: string;
}

export default function CryptoCard({ name, image, price, priceChange, marketCapRank, symbol, id }: CryptoCardProps) {
  const showChange = Math.abs(priceChange) >= 0.01;
  const percentColor = priceChange > 0 ? "text-green-600" : priceChange < 0 ? "text-red-600" : "text-muted-foreground";
  return (
    <Link href={`/dashboard/crypto/${id}`} className="block group focus:outline-none">
      <Card className="flex flex-col items-center justify-center p-6 shadow-lg rounded-2xl bg-card/90 group-hover:scale-105 group-hover:ring-2 group-hover:ring-primary/40 transition-transform duration-200 relative max-h-[220px] cursor-pointer">
        {/* Market Cap Rank */}
        <span className="absolute top-3 left-3 bg-primary/90 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
          #{marketCapRank}
        </span>
        <span className="text-lg font-semibold text-center text-foreground mb-0.5">{name}</span>
        <Image src={image} alt={name} width={48} height={48} className="mb-3 rounded-full shadow" />
        <CardContent className="p-0 flex flex-col items-center">
          <span className="text-xs uppercase text-muted-foreground mb-1">{symbol}</span>
          <span className="text-base font-mono text-foreground">${price.toLocaleString()}</span>
          {showChange ? (
            <span className={`text-xs font-medium mt-1 ${percentColor}`}>
              {priceChange > 0 ? "+" : ""}{priceChange.toFixed(2)}%
            </span>
          ) : (
            <span className="text-xs font-medium mt-1 text-muted-foreground">-</span>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
