"use client";
import { SessionProvider } from "next-auth/react";
import DashboardHeader from "@/components/DashboardHeader";
import { AppSidebar } from "@/components/Sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";





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
            
              
              {children}
            
          </SidebarInset>
        </SidebarProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
} 