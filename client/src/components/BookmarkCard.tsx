'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark } from '@/types/bookmark';
import { useBookmarkOperations } from '@/hooks/useBookmarks';
import { 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Trash2, 
  ExternalLink,
  Bitcoin,
  Building2,
  DollarSign,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

interface BookmarkCardProps {
  bookmark: Bookmark;
  showPrice?: boolean;
  price?: number;
  change?: number;
  changePercentage?: number;
}

export default function BookmarkCard({ 
  bookmark, 
  showPrice = false, 
  price, 
  change, 
  changePercentage 
}: BookmarkCardProps) {
  const { deleteBookmark, isDeleting } = useBookmarkOperations();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'crypto':
        return <Bitcoin className="w-5 h-5 text-orange-500" />;
      case 'stocks':
        return <Building2 className="w-5 h-5 text-blue-500" />;
      case 'commodities':
        return <DollarSign className="w-5 h-5 text-yellow-500" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'crypto':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'stocks':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'commodities':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriceChangeDisplay = (change: number, changePercentage: number) => {
    if (change > 0) {
      return {
        icon: <TrendingUp className="w-4 h-4" />,
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900/20',
      };
    } else if (change < 0) {
      return {
        icon: <TrendingDown className="w-4 h-4" />,
        color: 'text-red-600',
        bgColor: 'bg-red-100 dark:bg-red-900/20',
      };
    } else {
      return {
        icon: <Minus className="w-4 h-4" />,
        color: 'text-gray-600',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
      };
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1e9) return `$${(price / 1e9).toFixed(2)}B`;
    if (price >= 1e6) return `$${(price / 1e6).toFixed(2)}M`;
    if (price >= 1e3) return `$${(price / 1e3).toFixed(2)}K`;
    return `$${price.toFixed(2)}`;
  };

  const getDetailPageUrl = () => {
    switch (bookmark.category) {
      case 'crypto':
        return `/dashboard/crypto/${bookmark.symbol}`;
      case 'stocks':
        return `/dashboard/stocks/${bookmark.symbol}`;
      case 'commodities':
        return `/dashboard/commodities/${bookmark.symbol}`;
      default:
        return '#';
    }
  };

  const handleDelete = () => {
    deleteBookmark(bookmark.id);
  };

  const priceChangeDisplay = showPrice && change !== undefined && changePercentage !== undefined 
    ? getPriceChangeDisplay(change, changePercentage) 
    : null;

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getCategoryIcon(bookmark.category)}
            <div>
              <CardTitle className="text-lg font-semibold">
                {bookmark.symbol}
              </CardTitle>
              <Badge 
                variant="secondary" 
                className={`mt-1 ${getCategoryColor(bookmark.category)}`}
              >
                {bookmark.category}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {showPrice && price !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-foreground">
                {formatPrice(price)}
              </span>
              {priceChangeDisplay && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${priceChangeDisplay.bgColor}`}>
                  {priceChangeDisplay.icon}
                  <span className={`text-sm font-medium ${priceChangeDisplay.color}`}>
                    {changePercentage > 0 ? '+' : ''}{changePercentage.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>
                Added {formatDistanceToNow(new Date(bookmark.createdAt), { addSuffix: true })}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 px-2"
            >
              <Link href={getDetailPageUrl()} className="flex items-center gap-1">
                <span>View Details</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
