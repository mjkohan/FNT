'use client';

import { Button } from '@/components/ui/button';
import { useBookmarkButton } from '@/hooks/useBookmarks';
import { Star, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  category: 'crypto' | 'stocks' | 'commodities';
  symbol: string;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showText?: boolean;
}

export default function BookmarkButton({
  category,
  symbol,
  variant = 'outline',
  size = 'sm',
  className,
  showText = false,
}: BookmarkButtonProps) {
  const { isBookmarked, handleToggle, isLoading } = useBookmarkButton(category, symbol);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleToggle();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'transition-all duration-200',
        isBookmarked 
          ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500' 
          : 'hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-600',
        className
      )}
      aria-label={isBookmarked ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Star 
          className={cn(
            'w-4 h-4',
            isBookmarked && 'fill-current'
          )} 
        />
      )}
      {showText && (
        <span className="ml-2">
          {isBookmarked ? 'Watching' : 'Watch'}
        </span>
      )}
    </Button>
  );
}
