"use client";
import { SessionProvider } from "next-auth/react";
import DashboardHeader from "@/components/DashboardHeader";
import { AppSidebar } from "@/components/Sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { Bitcoin, BarChart2, Building2, TrendingUp, DollarSign } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

function DashboardTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const tabs = [
    { value: "crypto", label: "Crypto", icon: Bitcoin },
    { value: "stocks", label: "Stocks", icon: Building2 },
    { value: "futures", label: "Futures", icon: TrendingUp },
    { value: "forex", label: "Forex", icon: DollarSign },
  ];
  const current = pathname.split("/")[2] || "crypto";
  return (
    <Tabs value={current} className="w-full max-w-4xl mx-auto mt-4">
      <TabsList className="w-full grid grid-cols-4 gap-2 bg-muted/60 rounded-2xl p-1 shadow-none">
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
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isDetailPage = segments.length > 2; 
  
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <DashboardHeader />
            <div className="flex flex-1 flex-col gap-4 p-4">
              {!isDetailPage && <DashboardTabs />}
              
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
} 