import * as React from "react"
import { usePathname } from "next/navigation"
import { 
  Home, 
  Newspaper, 
  Star, 
  User, 
  Bitcoin, 
  BarChart2, 
  Building2, 
  TrendingUp, 
  DollarSign,
  Settings,
  LogOut
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/theme-toggle"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  
  const navigationData = [
    {
      title: "",
      items: [
        {
          title: "Home",
          url: "/dashboard",
          icon: Home,
          isActive: pathname === "/dashboard"
        },
        {
          title: "Latest News",
          url: "/dashboard/news",
          icon: Newspaper,
          isActive: pathname === "/dashboard/news"
        },
        {
          title: "Watchlist",
          url: "/dashboard/watchlist",
          icon: Star,
          isActive: pathname === "/dashboard/watchlist"
        }
      ]
    },
    {
      title: "Trading Markets",
      items: [
        {
          title: "Crypto",
          url: "/dashboard/crypto",
          icon: Bitcoin,
          isActive: pathname.includes("/dashboard/crypto")
        },
        {
          title: "Indices",
          url: "/dashboard/indices",
          icon: BarChart2,
          isActive: pathname.includes("/dashboard/indices")
        },
        {
          title: "Stocks",
          url: "/dashboard/stocks",
          icon: Building2,
          isActive: pathname.includes("/dashboard/stocks")
        },
        {
          title: "Futures",
          url: "/dashboard/futures",
          icon: TrendingUp,
          isActive: pathname.includes("/dashboard/futures")
        },
        {
          title: "Forex",
          url: "/dashboard/forex",
          icon: DollarSign,
          isActive: pathname.includes("/dashboard/forex")
        }
      ]
    },
    {
      title: "Account",
      items: [
        {
          title: "Profile",
          url: "/dashboard/profile",
          icon: User,
          isActive: pathname.includes("/dashboard/profile")
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
          icon: Settings,
          isActive: pathname.includes("/dashboard/settings")
        }
      ]
    }
  ]

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-border/50 pb-4">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">F</span>
          </div>
          <span className="font-semibold ">Financial News Tracker</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        {navigationData.map((group) => (
          <SidebarGroup key={group.title}>
            {group.title && (
              <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {group.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={item.isActive}
                        variant={item.isActive ? "primary" : "default"}
                        size="lg"
                      >
                        <a 
                          href={item.url} 
                          className="flex items-center gap-4 px-6 py-4 rounded-lg transition-colors w-full"
                        >
                          <Icon className="w-6 h-6" />
                          <span className="font-medium text-base">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      {/* Theme Toggle at Bottom */}
      <div className="border-t flex justify-center border-border/50 p-4">
        <ModeToggle />
      </div>
      
      <SidebarRail />
    </Sidebar>
  )
}

