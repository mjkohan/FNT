"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Bitcoin, 
  Building2, 
  BarChart3,
  Star,
  Activity,
  ArrowRight,
  Eye,
  Calendar,
  ExternalLink,
  RefreshCw,
  Briefcase,
  Globe,
  Cpu
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTopHeadlines } from "@/hooks/useTopHeadlines";
import { NewsService, NewsArticle, NewsResponse } from "@/services/newsService";

interface HeadlinesContentProps {
  data: NewsResponse | undefined;
  loading: boolean;
  error: any;
  onRetry: () => void;
  category: string;
}

function HeadlinesContent({ data, loading, error, onRetry, category }: HeadlinesContentProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="space-y-2 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          Failed to load {category.toLowerCase()} headlines. Please try again.
        </p>
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  if (!data?.articles || data.articles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No {category.toLowerCase()} headlines available at the moment</p>
        <Button 
          onClick={onRetry} 
          variant="outline" 
          className="mt-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.articles.slice(0, 6).map((article: NewsArticle, index: number) => (
          <div key={index} className="space-y-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{category}</Badge>
              <span className="text-xs text-muted-foreground">
                {NewsService.formatDate(article.publishedAt)}
              </span>
            </div>
            <h4 className="font-medium line-clamp-2">
              {NewsService.truncateText(article.title, 80)}
            </h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {NewsService.truncateText(article.description || '', 100)}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{article.source.name}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2"
                asChild
              >
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  Read more
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {data.articles.length > 6 && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" className="w-full max-w-xs">
            View All {category} Headlines
          </Button>
        </div>
      )}
    </div>
  );
}

export default function DashboardHome() {
  const [activeCategory, setActiveCategory] = useState('business');
  
  const { 
    data: headlinesData, 
    isLoading: headlinesLoading, 
    error: headlinesError, 
    refetch: refetchHeadlines 
  } = useTopHeadlines({
    country: 'us',
    category: activeCategory,
    pageSize: 6
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
        
      </div>

      {/* Quick Stats */}
      

      {/* Market Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/dashboard/crypto">
            <CardHeader className="">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <Bitcoin className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Cryptocurrency</CardTitle>
                    <CardDescription>Digital assets & blockchain</CardDescription>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/dashboard/stocks">
            <CardHeader className="">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Stocks</CardTitle>
                    <CardDescription>Equity markets & indices</CardDescription>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/dashboard/commodities">
            <CardHeader className="">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Commodities</CardTitle>
                    <CardDescription>Raw materials & resources</CardDescription>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            
          </Link>
        </Card>
      </div>

      {/* Top Headlines */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <div>
                <CardTitle>Top Headlines</CardTitle>
                <CardDescription>
                  Latest news from around the world
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetchHeadlines()}
              disabled={headlinesLoading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${headlinesLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="business" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Business
              </TabsTrigger>
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="technology" className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                Technology
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="business" className="mt-6">
              <HeadlinesContent 
                data={headlinesData} 
                loading={headlinesLoading} 
                error={headlinesError} 
                onRetry={refetchHeadlines}
                category="Business"
              />
            </TabsContent>
            
            <TabsContent value="general" className="mt-6">
              <HeadlinesContent 
                data={headlinesData} 
                loading={headlinesLoading} 
                error={headlinesError} 
                onRetry={refetchHeadlines}
                category="General"
              />
            </TabsContent>
            
            <TabsContent value="technology" className="mt-6">
              <HeadlinesContent 
                data={headlinesData} 
                loading={headlinesLoading} 
                error={headlinesError} 
                onRetry={refetchHeadlines}
                category="Technology"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Activity & Quick Actions */}
      

      
    </div>
  );
} 