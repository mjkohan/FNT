"use client";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";

export default function DashboardHeader() {
  const { data: session } = useSession();
  if (!session?.user) return null;
  return (
    <header className="w-full pl-20 flex items-center h-16 justify-between pl-6  bg-card/80 border-b border-border/50 shadow-sm  ">
      <div className="flex items-center gap-2">
        
        <span className="font-bold text-4xl tracking-wide">FNT</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-full  md:min-w-[260px] px-6 py-0 rounded-none bg-transparent border-0 border-l-1 border-muted shadow-none hover:bg-muted/30 focus-visible:ring-0 focus-visible:ring-offset-0 flex flex-row items-center gap-4 justify-between"
            aria-label="User menu"
          >
            <div className="flex flex-col items-start text-left flex-1">
              <span className="font-bold text-base text-primary leading-tight truncate max-w-[170px]">
                {session.user.email}
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">FNT Basic</span>
            </div>
            <ChevronDown className="ml-2 text-muted-foreground" size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[260px] w-[260px] p-2 rounded-xl bg-card/95 border border-border/70 shadow-lg">
          <DropdownMenuLabel className="text-lg font-semibold px-2 pb-1">Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem asChild className="flex items-center gap-3 px-3 py-3 text-base font-medium rounded-lg hover:bg-muted/40 transition-colors">
            <a href="/dashboard/profile" className="flex items-center gap-3 w-full">
              <User className="w-5 h-5 text-primary" />
              Profile
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="flex items-center gap-3 px-3 py-3 text-base font-medium rounded-lg hover:bg-muted/40 transition-colors">
            <a href="/dashboard/settings" className="flex items-center gap-3 w-full">
              <Settings className="w-5 h-5 text-primary" />
              Settings
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-3 px-3 py-3 text-base font-semibold text-destructive rounded-lg hover:bg-destructive/10 cursor-pointer transition-colors">
            <LogOut className="w-5 h-5 text-destructive" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
} 