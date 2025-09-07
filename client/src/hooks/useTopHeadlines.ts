import { useQuery } from '@tanstack/react-query';
import { NewsService } from '@/services/newsService';

interface UseTopHeadlinesOptions {
  country?: string;
  category?: string;
  pageSize?: number;
  enabled?: boolean;
}

export function useTopHeadlines({
  country = 'us',
  category = 'business',
  pageSize = 10,
  enabled = true
}: UseTopHeadlinesOptions = {}) {
  return useQuery({
    queryKey: ['top-headlines', country, category, pageSize],
    queryFn: () => NewsService.fetchTopHeadlines(country, category, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    enabled,
  });
}
