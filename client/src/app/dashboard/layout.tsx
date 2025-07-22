"use client";
import { SessionProvider } from "next-auth/react";
import DashboardHeader from "@/components/DashboardHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-muted/20 to-muted/40 ">
      <SessionProvider>
        <DashboardHeader />
        <main className="flex-1 flex flex-col items-center justify-center w-full">
          {children}
        </main>
      </SessionProvider>
    </div>
  );
} 