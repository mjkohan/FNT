import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarkService } from '@/services/bookmarkService';
import { Bookmark, CreateBookmarkRequest, UpdateBookmarkRequest } from '@/types/bookmark';
import { toast } from 'sonner';

// Hook for fetching all bookmarks
export function useBookmarks() {
  return useQuery({
    queryKey: ['bookmarks'],
    queryFn: bookmarkService.getBookmarks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for fetching bookmarks by category
export function useBookmarksByCategory(category: 'crypto' | 'stocks' | 'commodities') {
  return useQuery({
    queryKey: ['bookmarks', category],
    queryFn: () => bookmarkService.getBookmarksByCategory(category),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for checking if an item is bookmarked
export function useIsBookmarked(category: 'crypto' | 'stocks' | 'commodities', symbol: string) {
  const { data: bookmarks } = useBookmarks();
  
  return bookmarks?.some(bookmark => 
    bookmark.category === category && bookmark.symbol === symbol
  ) ?? false;
}

// Hook for bookmark operations (create, update, delete, toggle)
export function useBookmarkOperations() {
  const queryClient = useQueryClient();

  const createBookmarkMutation = useMutation({
    mutationFn: bookmarkService.createBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('Added to watchlist');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateBookmarkMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBookmarkRequest }) =>
      bookmarkService.updateBookmark(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('Bookmark updated');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteBookmarkMutation = useMutation({
    mutationFn: bookmarkService.deleteBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('Removed from watchlist');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const toggleBookmarkMutation = useMutation({
    mutationFn: bookmarkService.toggleBookmark,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      if (data.action === 'added') {
        toast.success('Added to watchlist');
      } else {
        toast.success('Removed from watchlist');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    createBookmark: createBookmarkMutation.mutate,
    updateBookmark: updateBookmarkMutation.mutate,
    deleteBookmark: deleteBookmarkMutation.mutate,
    toggleBookmark: toggleBookmarkMutation.mutate,
    isCreating: createBookmarkMutation.isPending,
    isUpdating: updateBookmarkMutation.isPending,
    isDeleting: deleteBookmarkMutation.isPending,
    isToggling: toggleBookmarkMutation.isPending,
  };
}

// Hook for bookmark button functionality
export function useBookmarkButton(
  category: 'crypto' | 'stocks' | 'commodities',
  symbol: string
) {
  const isBookmarked = useIsBookmarked(category, symbol);
  const { toggleBookmark, isToggling } = useBookmarkOperations();

  const handleToggle = useCallback(() => {
    toggleBookmark({ category, symbol });
  }, [category, symbol, toggleBookmark]);

  return {
    isBookmarked,
    handleToggle,
    isLoading: isToggling,
  };
}
