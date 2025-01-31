import { useState, useCallback } from 'react';
import { Prefecture } from '@/types/api/prefecture';
import { fetchPrefectures } from '@/services/api/prefecture';

const CACHE_KEY = 'prefecture_data';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24時間

interface CacheData {
  data: Prefecture[];
  timestamp: number;
}

export const usePrefectureData = () => {
  const [data, setData] = useState<Prefecture[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [source, setSource] = useState<'cache' | 'api' | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // キャッシュをチェック
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data: prefectures, timestamp }: CacheData = JSON.parse(cachedData);
        const isValid = Date.now() - timestamp < CACHE_DURATION;
        
        if (isValid) {
          console.log('都道府県一覧: キャッシュからデータを取得しました');
          setData(prefectures);
          setSource('cache');
          return 'cache';
        }
      }

      // APIから取得
      const prefectures = await fetchPrefectures();
      
      // キャッシュを更新
      const cacheData: CacheData = {
        data: prefectures,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      
      console.log('都道府県一覧: APIからデータを取得しました');
      setData(prefectures);
      setSource('api');
      return 'api';
    } catch (err) {
      const error = err instanceof Error ? err : new Error('予期せぬエラーが発生しました');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCache = useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
    setData([]);
    setSource(null);
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchData,
    clearCache,
    source,
  };
}; 