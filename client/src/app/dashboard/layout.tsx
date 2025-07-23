"use client";
import { SessionProvider } from "next-auth/react";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { Bitcoin, BarChart2, Building2, TrendingUp, DollarSign } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

function DashboardTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const tabs = [
    { value: "crypto", label: "Crypto", icon: Bitcoin },
    { value: "indices", label: "Indices", icon: BarChart2 },
    { value: "stocks", label: "Stocks", icon: Building2 },
    { value: "futures", label: "Futures", icon: TrendingUp },
    { value: "forex", label: "Forex", icon: DollarSign },
  ];
  const current = pathname.split("/")[2] || "crypto";
  return (
    <Tabs value={current} className="w-full max-w-6xl mx-auto mt-4">
      <TabsList className="w-full grid grid-cols-5 gap-2 bg-muted/60 rounded-2xl p-1 shadow-none">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="w-full flex flex-col items-center justify-center gap-1 h-16 rounded-xl font-semibold text-base transition-all data-[state=active]:bg-purple-600 dark:data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-none hover:bg-primary/10 hover:text-primary border-none px-0"
              onClick={() => router.push(`/dashboard/${tab.value}`)}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="mt-0.5">{tab.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-muted/20 to-muted/40 ">
        <SessionProvider>
          <DashboardHeader />
          <div className="flex flex-1 flex-row w-full  h-0">
            <Sidebar />
            <main className="flex-1 flex flex-col w-full min-h-0 h-[calc(100vh-80px)]">
              <DashboardTabs />
              {children}
            </main>
          </div>
        </SessionProvider>
      </div>
    </QueryClientProvider>
  );
} 