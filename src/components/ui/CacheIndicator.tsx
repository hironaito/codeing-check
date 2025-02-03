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
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-full transition-all duration-300
        ${source === 'cache'
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-blue-50 text-blue-700 border border-blue-200'
        }
        ${className}
      `}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        {source === 'cache' ? (
          <Database className="h-4 w-4" />
        ) : (
          <RefreshCw className={`h-4 w-4 ${showSpinner ? 'animate-spin' : ''}`} />
        )}
        {source === 'cache' && (
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
        )}
      </span>
      <span className="font-medium">
        {source === 'cache' ? 'キャッシュ' : 'API'} ({fetchTimeMs}ms)
      </span>
    </div>
  );
}; 