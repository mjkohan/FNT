import {  useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarkService } from '@/services/bookmarkService';
import { Bookmark, CreateBookmarkRequest, UpdateBookmarkRequest } from '@/types/bookmark';
import { toast } from 'sonner';

// Hook for fetching all bookmarks
export function useBookmarks() {
  return useQuery({
    queryKey: ['bookmarks'],
    queryFn: bookmarkService.getBookmarks,
    staleTime: 0, // Always consider data stale
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

// Hook for fetching bookmarks by category
export function useBookmarksByCategory(category: 'crypto' | 'stocks' | 'commodities') {
  return useQuery({
    queryKey: ['bookmarks', category],
    queryFn: () => bookmarkService.getBookmarksByCategory(category),
    staleTime: 0, // Always consider data stale
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

// Hook for checking if an item is bookmarked
export function useIsBookmarked(category: 'crypto' | 'stocks' | 'commodities', symbol: string) {
  const { data: bookmarks, isLoading, error } = useBookmarks();
  
  const isBookmarked = bookmarks?.some(bookmark => 
    bookmark.category === category && bookmark.symbol === symbol
  ) ?? false;
  
  return isBookmarked;
}

// Hook for bookmark operations (create, update, delete, toggle)
export function useBookmarkOperations() {
  const queryClient = useQueryClient();

  const createBookmarkMutation = useMutation({
    mutationFn: bookmarkService.createBookmark,
    onMutate: async (newBookmark: CreateBookmarkRequest) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['bookmarks'] });

      // Snapshot the previous value
      const previousBookmarks = queryClient.getQueryData(['bookmarks']);

      // Optimistically update to the new value
      queryClient.setQueryData(['bookmarks'], (old: Bookmark[] | undefined) => {
        if (!old) return old;
        const optimisticBookmark: Bookmark = {
          id: Date.now(), // Temporary ID
          ...newBookmark,
          userId: 1, // This will be replaced by the server
          createdAt: new Date().toISOString(),
        };
        return [...old, optimisticBookmark];
      });

      return { previousBookmarks };
    },
    onError: (err, newBookmark, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousBookmarks) {
        queryClient.setQueryData(['bookmarks'], context.previousBookmarks);
      }
      toast.error('Failed to add bookmark');
    },
    onSuccess: async () => {
      // Force refetch from server to get the real data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['bookmarks'], refetchType: 'active' }),
        queryClient.invalidateQueries({ queryKey: ['bookmarks', 'crypto'], refetchType: 'active' }),
        queryClient.invalidateQueries({ queryKey: ['bookmarks', 'stocks'], refetchType: 'active' }),
        queryClient.invalidateQueries({ queryKey: ['bookmarks', 'commodities'], refetchType: 'active' })
      ]);
      toast.success('Added to watchlist');
    },
  });

  const updateBookmarkMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBookmarkRequest }) =>
      bookmarkService.updateBookmark(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['bookmarks'] });
      const previousBookmarks = queryClient.getQueryData(['bookmarks']);

      queryClient.setQueryData(['bookmarks'], (old: Bookmark[] | undefined) => {
        if (!old) return old;
        return old.map(bookmark =>
          bookmark.id === id
            ? { ...bookmark, ...data }
            : bookmark
        );
      });

      return { previousBookmarks };
    },
    onError: (err, variables, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(['bookmarks'], context.previousBookmarks);
      }
      toast.error('Failed to update bookmark');
    },
    onSuccess: async () => {
      // Force refetch from server to get the real data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['bookmarks'], refetchType: 'active' }),
        queryClient.invalidateQueries({ queryKey: ['bookmarks', 'crypto'], refetchType: 'active' }),
        queryClient.invalidateQueries({ queryKey: ['bookmarks', 'stocks'], refetchType: 'active' }),
        queryClient.invalidateQueries({ queryKey: ['bookmarks', 'commodities'], refetchType: 'active' })
      ]);
      toast.success('Bookmark updated');
    },
  });

  const deleteBookmarkMutation = useMutation({
    mutationFn: bookmarkService.deleteBookmark,
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['bookmarks'] });
      const previousBookmarks = queryClient.getQueryData(['bookmarks']);

      queryClient.setQueryData(['bookmarks'], (old: Bookmark[] | undefined) => {
        if (!old) return old;
        return old.filter(bookmark => bookmark.id !== id);
      });

      return { previousBookmarks };
    },
    onError: (err, id, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(['bookmarks'], context.previousBookmarks);
      }
      toast.error('Failed to remove bookmark');
    },
    onSuccess: async () => {
      // Force refetch from server to get the real data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['bookmarks'], refetchType: 'active' }),
        queryClient.invalidateQueries({ queryKey: ['bookmarks', 'crypto'], refetchType: 'active' }),
        queryClient.invalidateQueries({ queryKey: ['bookmarks', 'stocks'], refetchType: 'active' }),
        queryClient.invalidateQueries({ queryKey: ['bookmarks', 'commodities'], refetchType: 'active' })
      ]);
      toast.success('Removed from watchlist');
    },
  });

  const toggleBookmarkMutation = useMutation({
    mutationFn: bookmarkService.toggleBookmark,
    onError: () => {
      // Force refetch from server on error to get correct state
      queryClient.refetchQueries({ queryKey: ['bookmarks'] });
      queryClient.refetchQueries({ queryKey: ['bookmarks', 'crypto'] });
      queryClient.refetchQueries({ queryKey: ['bookmarks', 'stocks'] });
      queryClient.refetchQueries({ queryKey: ['bookmarks', 'commodities'] });
      toast.error('Failed to toggle bookmark');
    },
    onSuccess: async (data) => {
      // Force refetch from server to get the real data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['bookmarks'], refetchType: 'active' }),
        queryClient.invalidateQueries({ queryKey: ['bookmarks', 'crypto'], refetchType: 'active' }),
        queryClient.invalidateQueries({ queryKey: ['bookmarks', 'stocks'], refetchType: 'active' }),
        queryClient.invalidateQueries({ queryKey: ['bookmarks', 'commodities'], refetchType: 'active' })
      ]);
      if (data.action === 'added') {
        toast.success('Added to watchlist');
      } else {
        toast.success('Removed from watchlist');
      }
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
    // Make the API call and let the mutation handle the refetch
    toggleBookmark({ category, symbol });
  }, [category, symbol, toggleBookmark]);

  return {
    isBookmarked,
    handleToggle,
    isLoading: isToggling,
  };
}
