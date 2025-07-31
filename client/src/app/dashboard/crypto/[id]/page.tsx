"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import TradingViewChart from "@/components/TradingViewChart";

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
    <div className="w-full max-w-3xl mx-auto mt-8 flex flex-col gap-8">
      <Card className="flex flex-col md:flex-row items-center gap-6 p-6">
        <Image src={coin.image} alt={coin.name} width={64} height={64} className="rounded-full shadow" />
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
            {coin.name} <span className="text-base text-muted-foreground uppercase">({coin.symbol})</span>
          </h2>
          <div className="flex flex-wrap gap-4 mt-2">
            <span className="text-lg font-mono">${coin.current_price.toLocaleString()}</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">Rank #{coin.market_cap_rank}</span>
            <span className="text-xs bg-muted px-2 py-1 rounded-full font-semibold">Market Cap: ${coin.market_cap.toLocaleString()}</span>
            <span className="text-xs bg-muted px-2 py-1 rounded-full font-semibold">Volume: ${coin.total_volume.toLocaleString()}</span>
          </div>
        </div>
      </Card>
      <div className="flex-1 overflow-y-auto min-h-0 max-h-[60vh] flex flex-col gap-6 scrollbar-hide">
        {/* Price Box */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-purple-700">Price & Change</h3>
          <div className="flex flex-wrap gap-3">
            {priceFields.map(f => (
              <span key={f.label} className={`px-3 py-2 rounded-lg font-mono text-sm font-semibold ${f.color}`}>{f.label}: {f.value}</span>
            ))}
          </div>
        </Card>
        {/* Supply Box */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-blue-700">Supply</h3>
          <div className="flex flex-wrap gap-3">
            {supplyFields.map(f => (
              <span key={f.label} className={`px-3 py-2 rounded-lg font-mono text-sm font-semibold ${f.color}`}>{f.label}: {f.value}</span>
            ))}
          </div>
        </Card>
        {/* Cap/Volume Box */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-yellow-700">Market Cap & Volume</h3>
          <div className="flex flex-wrap gap-3">
            {capFields.map(f => (
              <span key={f.label} className={`px-3 py-2 rounded-lg font-mono text-sm font-semibold ${f.color}`}>{f.label}: {f.value}</span>
            ))}
          </div>
        </Card>
        {/* ATH/ATL Box */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-pink-700">ATH & ATL</h3>
          <div className="flex flex-wrap gap-3">
            {athAtlFields.map(f => (
              <span key={f.label} className={`px-3 py-2 rounded-lg font-mono text-sm font-semibold ${f.color}`}>{f.label}: {f.value}</span>
            ))}
          </div>
        </Card>
        <TradingViewChart symbol={coin.name} />
      </div>
      
      {/* TradingView Widget */}
      {/* <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Chart</h3>
        <div className="w-full h-[400px]">
          <iframe
            src={`https://www.tradingview.com/embed-widget/symbol-overview/?symbol=BINANCE:${coin.symbol.toUpperCase()}USDT&locale=en`}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            className="rounded-xl border border-border/30"
            title={`${coin.symbol.toUpperCase()} Chart`}
          />
        </div>
      </Card> */}
      
    </div>
  );
} 