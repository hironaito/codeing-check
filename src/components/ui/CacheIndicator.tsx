'use client';

import { FC, useEffect, useState } from 'react';
import { Database, RefreshCw } from 'lucide-react';

interface CacheIndicatorProps {
  source: 'cache' | 'api' | null;
  fetchTimeMs: number | null;
  className?: string;
  isLoading?: boolean;
}

export const CacheIndicator: FC<CacheIndicatorProps> = ({
  source,
  fetchTimeMs,
  className = '',
  isLoading = false,
}) => {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShowSpinner(true);
    } else {
      // データ取得完了後、1秒待ってからスピナーを停止
      const timer = setTimeout(() => {
        setShowSpinner(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!source || fetchTimeMs === null) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 sm:gap-2 h-8 px-2 sm:px-3 text-xs sm:text-sm rounded-md sm:rounded-full transition-all duration-300
        ${source === 'cache'
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-blue-50 text-blue-700 border border-blue-200'
        }
        ${className}
      `}
    >
      <span className="relative flex h-4 sm:h-5 w-4 sm:w-5 items-center justify-center">
        {source === 'cache' ? (
          <Database className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
        ) : (
          <RefreshCw className={`h-3.5 sm:h-4 w-3.5 sm:w-4 ${showSpinner ? 'animate-spin' : ''}`} />
        )}
        {source === 'cache' && (
          <span className="absolute top-0 right-0 h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-green-400 animate-pulse" />
        )}
      </span>
      <span className="font-medium whitespace-nowrap">
        {source === 'cache' ? 'キャッシュ' : 'API'} ({fetchTimeMs}ms)
      </span>
    </div>
  );
}; 