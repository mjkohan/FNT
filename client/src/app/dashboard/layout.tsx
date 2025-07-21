"use client";
import { SessionProvider } from "next-auth/react";
import ClientNav from "@/components/client-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ClientNav />
      {children}
    </SessionProvider>
  );
} 