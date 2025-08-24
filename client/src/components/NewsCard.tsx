import { NewsArticle } from "@/services/newsService";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Clock, User, Newspaper } from "lucide-react";
import Link from "next/link";

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <Card className="group hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/20 transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-blue-600 hover:scale-[1.02] transform">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Image Section */}
          <div className="flex-shrink-0">
            {article.urlToImage ? (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-md">
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                {/* Fallback placeholder - hidden by default, shown on image error */}
                <div className="hidden w-24 h-24 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center shadow-md absolute inset-0">
                  <Newspaper className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                </div>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center shadow-md">
                <Newspaper className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-blue-600 transition-colors">
                {article.title}
              </h3>
              <Link
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 p-1 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-full transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-blue-500" />
              </Link>
            </div>

            {article.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {truncateText(article.description, 120)}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              
              {article.author && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span className="truncate max-w-24">{article.author}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Newspaper className="w-3 h-3" />
                <span className="truncate max-w-24">{article.source.name}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
