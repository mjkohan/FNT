"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Newspaper, Star, User, Menu, Crown } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/news", label: "Latest News", icon: Newspaper },
  { href: "/dashboard/watchlist", label: "Watchlist", icon: Star },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-3 left-4 z-[9999] p-2 rounded-lg bg-card/90 border border-border/50 shadow hover:bg-muted/40 transition"
        aria-label="Open sidebar"
        onClick={() => setOpen(!open)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          flex flex-col justify-between bg-card/90 border-r border-border/50 shadow-md w-56 min-w-[180px] py-6 px-3
           fixed top-0 left-0 z-50 transition-transform duration-300
          md:static md:translate-x-0 md:flex h-full md:h-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
        
        aria-label="Sidebar navigation"
        tabIndex={-1}
      >
        <nav className="flex flex-col gap-2 mt-16 md:mt-0">
          {links.map(({ href, label, icon: Icon }) => {
            let active = false;
            if (href === "/dashboard") {
              active = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
            } else {
              active = pathname === href;
            }
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors
                  ${active ? "bg-primary/10 text-primary" : "hover:bg-muted/40 text-muted-foreground"}`}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-col items-center justify-center pt-8 gap-4">
          <Button
            variant="secondary"
            className="w-full cursor-pointer flex items-center gap-2 rounded-xl font-semibold shadow hover:bg-yellow-100/80 text-yellow-700 bg-yellow-50 border-none"
            aria-label="Become Premium"
          >
            <Crown className="w-5 h-5 text-yellow-500" />
            Become Premium
          </Button>
          <ModeToggle />
        </div>
      </aside>
    </>
  );
}
