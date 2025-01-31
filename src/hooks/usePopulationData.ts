import { useState, useCallback } from 'react';
import { fetchPopulationData } from '@/services/api/population';
import { PopulationResponse } from '@/types/api/population';
import { API_ERROR_MESSAGES } from '@/constants/api';
import { cacheStore } from '@/utils/cache';

export interface UsePopulationDataReturn {
  data: Map<number, PopulationResponse>;
  isLoading: boolean;
  error: Error | null;
  fetchData: (prefCode: number) => Promise<void>;
  clearCache: () => void;
  fetchTimeMs: number | null;
  source: 'cache' | 'api' | null;
}

/**
 * キャッシュキーを生成
 */
const generateCacheKey = (prefCode: number): string => {
  return `population_${prefCode}`;
};

/**
 * 人口データを取得・管理するカスタムフック
 */
export const usePopulationData = (): UsePopulationDataReturn => {
  const [data, setData] = useState<Map<number, PopulationResponse>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [fetchTimeMs, setFetchTimeMs] = useState<number | null>(null);
  const [source, setSource] = useState<'cache' | 'api' | null>(null);

  /**
   * キャッシュをクリア
   */
  const clearCache = useCallback(() => {
    cacheStore.clear();
    setData(new Map());
    setFetchTimeMs(null);
    setSource(null);
  }, []);

  /**
   * 人口データを取得する
   */
  const fetchData = useCallback(async (prefCode: number) => {
    if (data.has(prefCode)) {
      return;
    }

    setIsLoading(true);
    setError(null);
    const start = performance.now();

    try {
      // キャッシュをチェック
      const cacheKey = generateCacheKey(prefCode);
      const cachedData = cacheStore.get<PopulationResponse>(cacheKey);

      if (cachedData) {
        console.log('Cache hit:', cacheKey);
        const cacheStart = performance.now();
        await Promise.resolve(); // 非同期処理を挟んで正確な時間を計測
        setData(prev => {
          const newData = new Map(prev);
          newData.set(prefCode, cachedData);
          return newData;
        });
        const end = performance.now();
        setFetchTimeMs(Math.round(end - cacheStart));
        setSource('cache');
        setIsLoading(false);
        return;
      }

      // APIからデータを取得
      console.log('Cache miss:', cacheKey);
      const response = await fetchPopulationData(prefCode);
      
      // キャッシュに保存
      cacheStore.set(cacheKey, response);
      setData(prev => {
        const newData = new Map(prev);
        newData.set(prefCode, response);
        return newData;
      });
      const end = performance.now();
      setFetchTimeMs(Math.round(end - start));
      setSource('api');
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : API_ERROR_MESSAGES.UNKNOWN;
      setError(new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchData,
    clearCache,
    fetchTimeMs,
    source,
  };
}; 