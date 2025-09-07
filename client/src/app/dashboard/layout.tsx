"use client";
import { SessionProvider } from "next-auth/react";
import DashboardHeader from "@/components/DashboardHeader";
import { AppSidebar } from "@/components/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";





export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  
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