'use client';

import { useState, useMemo } from 'react';
import { useBookmarks } from '@/hooks/useBookmarks';
import BookmarkCard from '@/components/BookmarkCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  Star, 
  Bitcoin,
  Building2,
  DollarSign,
  Grid3X3,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { Bookmark } from '@/types/bookmark';
import Link from 'next/link';

type SortOption = 'symbol' | 'category' | 'createdAt';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

export default function WatchlistPage() {
  const { data: bookmarks, isLoading, error } = useBookmarks();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredAndSortedBookmarks = useMemo(() => {
    if (!bookmarks) return [];

    const filtered = bookmarks.filter((bookmark: Bookmark) => {
      const matchesSearch = bookmark.symbol.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || bookmark.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a: Bookmark, b: Bookmark) => {
      let aValue: string | Date, bValue: string | Date;
      
      switch (sortBy) {
        case 'symbol':
          aValue = a.symbol.toLowerCase();
          bValue = b.symbol.toLowerCase();
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a.symbol.toLowerCase();
          bValue = b.symbol.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [bookmarks, search, selectedCategory, sortBy, sortDirection]);

  const categoryStats = useMemo(() => {
    if (!bookmarks) return {};
    
    return bookmarks.reduce((acc: Record<string, number>, bookmark: Bookmark) => {
      acc[bookmark.category] = (acc[bookmark.category] || 0) + 1;
      return acc;
    }, {});
  }, [bookmarks]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'crypto':
        return <Bitcoin className="w-4 h-4 text-orange-500" />;
      case 'stocks':
        return <Building2 className="w-4 h-4 text-blue-500" />;
      case 'commodities':
        return <DollarSign className="w-4 h-4 text-yellow-500" />;
      default:
        return <Star className="w-4 h-4" />;
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

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-0 w-full max-w-6xl mx-auto mt-8">
        <div className="text-center py-12 text-muted-foreground text-lg">
          Loading your watchlist...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col min-h-0 w-full max-w-6xl mx-auto mt-8">
        <div className="text-center py-12 text-destructive text-lg">
          Error loading watchlist: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full max-w-6xl mx-auto mt-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
          <Star className="w-8 h-8 text-yellow-500" />
          Watchlist
        </h1>
        <p className="text-muted-foreground">
          Your personalized collection of tracked assets
        </p>
        {bookmarks && bookmarks.length > 0 && (
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>Total: {bookmarks.length} items</span>
            {Object.entries(categoryStats).map(([category, count]) => (
              <Badge 
                key={category} 
                variant="secondary" 
                className={`${getCategoryColor(category)}`}
              >
                {getCategoryIcon(category)}
                <span className="ml-1">{category}: {count}</span>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-t-2xl flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-b mb-4">
        <div className="relative w-full sm:w-72">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search watchlist..."
            className="w-full pl-10 pr-4 rounded-xl shadow-sm focus-visible:ring-2 focus-visible:ring-primary/40 bg-muted/60 border-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl px-4 flex items-center gap-2 bg-muted/60 border-none shadow-sm">
                <Filter className="w-4 h-4" />
                <span>{selectedCategory === 'all' ? 'All Categories' : selectedCategory}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' ? 'font-bold bg-muted/40' : ''}
              >
                All Categories ({bookmarks?.length || 0})
              </DropdownMenuItem>
              {['crypto', 'stocks', 'commodities'].map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 'font-bold bg-muted/40' : ''}
                >
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <span className="capitalize">{category}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {categoryStats[category] || 0}
                    </Badge>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl px-4 flex items-center gap-2 bg-muted/60 border-none shadow-sm">
                <span>Sort by: {sortBy}</span>
                {sortDirection === 'asc' ? (
                  <SortAsc className="w-4 h-4" />
                ) : (
                  <SortDesc className="w-4 h-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[
                { value: 'symbol', label: 'Symbol' },
                { value: 'category', label: 'Category' },
                { value: 'createdAt', label: 'Date Added' },
              ].map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value as SortOption)}
                  className={sortBy === option.value ? 'font-bold bg-muted/40' : ''}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2"
              >
                {sortDirection === 'asc' ? (
                  <SortDesc className="w-4 h-4" />
                ) : (
                  <SortAsc className="w-4 h-4" />
                )}
                {sortDirection === 'asc' ? 'Descending' : 'Ascending'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-border rounded-xl overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-none border-0"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-none border-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredAndSortedBookmarks.length === 0 ? (
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {bookmarks?.length === 0 ? 'Your watchlist is empty' : 'No items match your filters'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {bookmarks?.length === 0 
              ? 'Start adding assets to your watchlist to track their performance'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
          {bookmarks?.length === 0 && (
            <div className="flex items-center justify-center gap-4">
              <Button asChild>
                <Link href="/dashboard/crypto">Browse Crypto</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/stocks">Browse Stocks</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/commodities">Browse Commodities</Link>
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className={`grid gap-6 overflow-y-auto  min-h-0 p-4 scrollbar-hide ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredAndSortedBookmarks.map((bookmark: Bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              showPrice={false} // You can enable this if you have price data
            />
          ))}
        </div>
      )}
    </div>
  );
}
