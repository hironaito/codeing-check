import { useState, useCallback, useMemo } from 'react';
import { fetchPopulationData } from '@/services/api/population';
import { PopulationResponse, PopulationComposition } from '@/types/api/population';
import { API_ERROR_MESSAGES } from '@/constants/api';

interface UsePopulationDataReturn {
  data: PopulationResponse | null;
  isLoading: boolean;
  error: Error | null;
  fetchData: (prefCode: number) => Promise<void>;
  totalPopulation: PopulationComposition | null;
  youngPopulation: PopulationComposition | null;
  workingPopulation: PopulationComposition | null;
  elderlyPopulation: PopulationComposition | null;
}

/**
 * 人口データを取得・管理するカスタムフック
 */
export const usePopulationData = (): UsePopulationDataReturn => {
  const [data, setData] = useState<PopulationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 人口データを取得する
   */
  const fetchData = useCallback(async (prefCode: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchPopulationData(prefCode);
      setData(response);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : API_ERROR_MESSAGES.UNKNOWN;
      setError(new Error(errorMessage));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 総人口データを抽出
   */
  const totalPopulation = useMemo(() => {
    if (!data?.result.data) return null;
    return data.result.data.find(item => item.label === '総人口') || null;
  }, [data]);

  /**
   * 年少人口データを抽出
   */
  const youngPopulation = useMemo(() => {
    if (!data?.result.data) return null;
    return data.result.data.find(item => item.label === '年少人口') || null;
  }, [data]);

  /**
   * 生産年齢人口データを抽出
   */
  const workingPopulation = useMemo(() => {
    if (!data?.result.data) return null;
    return data.result.data.find(item => item.label === '生産年齢人口') || null;
  }, [data]);

  /**
   * 老年人口データを抽出
   */
  const elderlyPopulation = useMemo(() => {
    if (!data?.result.data) return null;
    return data.result.data.find(item => item.label === '老年人口') || null;
  }, [data]);

  return {
    data,
    isLoading,
    error,
    fetchData,
    // 各人口区分のデータ
    totalPopulation,
    youngPopulation,
    workingPopulation,
    elderlyPopulation,
  };
}; 