import { apiClient } from './apiClient';
import type { PopulationResponse } from '@/types/api/population';

// 人口構成を取得
export const getPopulation = async (prefCode: number) => {
  const { data } = await apiClient.get<PopulationResponse>(
    '/api/v1/population/composition/perYear',
    {
      params: {
        prefCode,
      },
    }
  );
  return data.result;
}; 