"use client";
import { useQuery } from "@tanstack/react-query";
import CryptoCard from "./CryptoCard";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from "lucide-react";

async function fetchCrypto() {
  const res = await fetch("/api/crypto");
  if (!res.ok) throw new Error("Failed to fetch crypto data");
  return res.json();
}

const sortOptions = [
  { value: "market_cap", label: "Market Cap" },
  { value: "name", label: "Name" },
  { value: "price", label: "Price" },
  { value: "symbol", label: "Symbol" },
  { value: "price_change", label: "Price Change" },
];

type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null | Record<string, unknown>;
  last_updated: string;
};

export default function CryptoPage() {
  const { data, isLoading, error } = useQuery<Coin[]>({
    queryKey: ["crypto"],
    queryFn: fetchCrypto,
  });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("market_cap");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    if (!data) return [];
    const filtered = data.filter((coin: Coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
    filtered.sort((a: Coin, b: Coin) => {
      let aVal, bVal;
      switch (sortBy) {
        case "market_cap":
          aVal = a.market_cap;
          bVal = b.market_cap;
          break;
        case "name":
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case "price":
          aVal = a.current_price;
          bVal = b.current_price;
          break;
        case "symbol":
          aVal = a.symbol.toLowerCase();
          bVal = b.symbol.toLowerCase();
          break;
        case "price_change":
          aVal = a.price_change_percentage_24h;
          bVal = b.price_change_percentage_24h;
          break;
        default:
          aVal = a.market_cap;
          bVal = b.market_cap;
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [data, search, sortBy, sortDir]);

  if (isLoading) return <div className="text-center py-12 text-muted-foreground text-lg">Loading...</div>;
  if (error) return <div className="text-center py-12 text-destructive text-lg">Error loading data</div>;

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full max-w-6xl mx-auto mt-8">
      {/* Search and Sort Controls */}
      <div className="sticky top-0 z-10  rounded-t-2xl flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-b  mb-4 backdrop-blur-md">
        <div className="relative w-full sm:w-72">
          <Input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or symbol..."
            className="w-full pl-10 pr-4 rounded-xl shadow-sm focus-visible:ring-2 focus-visible:ring-primary/40 bg-muted/60 border-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl px-4 flex items-center gap-2 bg-muted/60 border-none shadow-sm">
                <span>Sort by: {sortOptions.find(o => o.value === sortBy)?.label}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              {sortOptions.map(option => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={sortBy === option.value ? "font-bold bg-muted/40" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            className="rounded-xl px-2 bg-muted/60 border-none shadow-sm"
            aria-label={sortDir === "asc" ? "Ascending" : "Descending"}
            onClick={() => setSortDir(d => (d === "asc" ? "desc" : "asc"))}
          >
            {sortDir === "asc" ? (
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M8 17l4 4 4-4M12 21V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M16 7l-4-4-4 4M12 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto flex-1 min-h-0 p-4 scrollbar-hide">
        {filtered.map((coin: Coin) => (
          <CryptoCard
            key={coin.id}
            id={coin.id}
            name={coin.name}
            image={coin.image}
            price={coin.current_price}
            priceChange={coin.price_change_percentage_24h}
            marketCapRank={coin.market_cap_rank}
            symbol={coin.symbol}
          />
        ))}
      </div>
      
    </div>
  );
}