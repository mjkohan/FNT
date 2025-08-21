"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import TradingViewChart from "@/components/TradingViewChart";
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
async function fetchCrypto() {
  const res = await fetch("/api/crypto", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch crypto data");
  return res.json();
}

export default function CryptoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ["crypto"],
    queryFn: fetchCrypto,
  });
  const coin = data?.find((c: any) => c.id === id);

  if (isLoading) return <div className="text-center py-12 text-muted-foreground text-lg">Loading...</div>;
  if (error || !coin) return <div className="text-center py-12 text-destructive text-lg">Coin not found</div>;
  console.log(coin);
  // Group related fields
  const priceFields = [
    { label: "Current Price", value: `$${coin.current_price.toLocaleString()}`, color: "bg-purple-100 text-purple-700" },
    { label: "24h High", value: `$${coin.high_24h.toLocaleString()}`, color: "bg-green-100 text-green-700" },
    { label: "24h Low", value: `$${coin.low_24h.toLocaleString()}`, color: "bg-red-100 text-red-700" },
    { label: "24h Change", value: `${coin.price_change_percentage_24h > 0 ? "+" : ""}${coin.price_change_percentage_24h.toFixed(2)}%`, color: coin.price_change_percentage_24h > 0 ? "bg-green-100 text-green-700" : coin.price_change_percentage_24h < 0 ? "bg-red-100 text-red-700" : "bg-muted text-muted-foreground" },
  ];
  const supplyFields = [
    { label: "Circulating Supply", value: coin.circulating_supply?.toLocaleString(), color: "bg-blue-100 text-blue-700" },
    { label: "Total Supply", value: coin.total_supply?.toLocaleString(), color: "bg-blue-50 text-blue-600" },
    { label: "Max Supply", value: coin.max_supply ? coin.max_supply.toLocaleString() : "-", color: "bg-blue-50 text-blue-600" },
  ];
  const capFields = [
    { label: "Market Cap", value: `$${coin.market_cap.toLocaleString()}`, color: "bg-yellow-100 text-yellow-700" },
    { label: "Market Cap Rank", value: `#${coin.market_cap_rank}`, color: "bg-yellow-50 text-yellow-600" },
    { label: "Volume (24h)", value: `$${coin.total_volume.toLocaleString()}`, color: "bg-orange-100 text-orange-700" },
  ];
  const athAtlFields = [
    { label: "All Time High", value: `$${coin.ath.toLocaleString()}`, color: "bg-pink-100 text-pink-700" },
    { label: "ATH Change %", value: `${coin.ath_change_percentage.toFixed(2)}%`, color: "bg-pink-50 text-pink-600" },
    { label: "All Time Low", value: `$${coin.atl.toLocaleString()}`, color: "bg-indigo-100 text-indigo-700" },
    { label: "ATL Change %", value: `${coin.atl_change_percentage.toFixed(2)}%`, color: "bg-indigo-50 text-indigo-600" },
  ];

  return (
    <div className="w-full  mt-8 flex flex-col ">
      <Card className="flex rounded-none flex-col md:flex-row items-center justify-between  p-6">
        <div className="flex items-center gap-4">
          <Image src={coin.image} alt={coin.name} width={64} height={64} className="rounded-full shadow" />
          <div className="flex-1 flex flex-col gap-2">
            <h2 className="text-3xl font-bold text-foreground uppercase flex items-center gap-2">
              {coin.symbol}
            </h2>
            <div className="flex flex-wrap gap-4 mt-2">
              <span className="text-2xl font-semibold text-muted-foreground italic ">{coin.name}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 flex-col">
            <div className="text-center">
              <span className="text-3xl font-bold text-foreground">${coin.current_price}</span>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center">
                <span
                  className={`text-xl font-semibold ${coin.price_change_percentage_24h > 0
                    ? 'text-green-600'
                    : coin.price_change_percentage_24h < 0
                      ? 'text-red-600'
                      : 'text-gray-600'
                    }`}
                >
                  {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
          <Link href={`/dashboard/crypto/${coin.symbol.toLowerCase()}`}>
            <Button
              variant="outline"
              size="lg"
              className="bg-gradient-to-r text-white hover:text-white cursor-pointer from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700  border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </Link>
        </div>

      </Card>
      <div className="flex-1  flex flex-col ">
        
        <div className="flex">
          <Card className="p-4 rounded-none w-1/2 flex flex-row justify-between">
            <div >
              <h3 className="text-lg font-semibold mb-2 text-purple-700">Market Cap Rank</h3>
              <div className="flex flex-wrap gap-3">
                {coin.market_cap_rank}
              </div>
            </div>
            <div >
              <h3 className="text-lg font-semibold mb-2 text-purple-700">Market Cap</h3>
              <div className="flex flex-wrap gap-3">
                {coin.market_cap}
              </div>
            </div>
          </Card>

          <Card className="p-4 rounded-none w-1/2 flex flex-row justify-between">
            <div >
              <h3 className="text-lg font-semibold mb-2 text-purple-700">24h High</h3>
              <div className="flex flex-wrap gap-3">
                {coin.high_24h}
              </div>
            </div>
            <div >
              <h3 className="text-lg font-semibold mb-2 text-purple-700">24h Low</h3>
              <div className="flex flex-wrap gap-3">
                {coin.low_24h}
              </div>
            </div>
          </Card>

        </div>
        <div className="flex">
          <Card className="p-4 rounded-none w-1/2 flex flex-row justify-between">
            <div >
              <h3 className="text-lg font-semibold mb-2 text-purple-700">ATH</h3>
              <div className="flex flex-wrap gap-3">
                {coin.ath}
              </div>
            </div>
            <div >
              <h3 className="text-lg font-semibold mb-2 text-purple-700">ATH Change %</h3>
              <div className="flex flex-wrap gap-3">
                {coin.ath_change_percentage}
              </div>
            </div>
          </Card>

          <Card className="p-4 rounded-none w-1/2 flex flex-row justify-between">
            <div >
              <h3 className="text-lg font-semibold mb-2 text-purple-700">ATL</h3>
              <div className="flex flex-wrap gap-3">
                {coin.atl}
              </div>
            </div>
            <div >
                <h3 className="text-lg font-semibold mb-2 text-purple-700">ATL Change %</h3>
              <div className="flex flex-wrap gap-3">
                {coin.atl_change_percentage}
              </div>
            </div>
          </Card>

        </div>
        <div className="flex">
          <Card className=" rounded-none p-0 w-1/2 ">
          <TradingViewChart symbol={coin.name} />
          </Card>

          <Card className="p-4 w-1/2 items-center justify-center rounded-none ">
            
              <h3 className="text-lg font-semibold mb-2 text-purple-700">Related News(soon ...)</h3>
              
            
          </Card>

        </div>

        
      </div>



    </div>
  );
} 