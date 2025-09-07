"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { Bitcoin, Building2, TrendingUp } from "lucide-react";


function DashboardTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const tabs = [
    { value: "crypto", label: "Crypto", icon: Bitcoin },
    { value: "stocks", label: "Stocks", icon: Building2 },
    { value: "commodities", label: "Commodities", icon: TrendingUp },
  ];
  const current = pathname.split("/")[2] || "crypto";
  return (
    <Tabs value={current} className="w-full max-w-4xl mx-auto mt-4">
      <TabsList className="w-full grid grid-cols-3 gap-2 bg-muted/60 rounded-2xl p-1 shadow-none">
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
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isDetailPage = segments.length > 2; 
  
  return (
    
            <div className="flex flex-1 flex-col gap-4 p-4">
              {!isDetailPage && <DashboardTabs />}
              
              {children}
            </div>
          
  );
} 