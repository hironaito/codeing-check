import { PopulationResponse } from '@/types/api/population';
import { API_ENDPOINTS } from '@/constants/api';

/**
 * APIの設定を取得・検証する
 */
const getAPIConfig = () => {
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  if (!apiEndpoint) {
    throw new Error('API endpoint is not configured');
  }

  if (!apiKey) {
    throw new Error('API key is not configured');
  }

  return { apiEndpoint, apiKey };
};

/**
 * 人口構成APIのインターフェース
 */
export const fetchPopulationData = async (
  prefCode: number
): Promise<PopulationResponse> => {
  const { apiEndpoint, apiKey } = getAPIConfig();
  const url = new URL(`${apiEndpoint}${API_ENDPOINTS.POPULATION.COMPOSITION}`);
  url.searchParams.append('prefCode', prefCode.toString());
  url.searchParams.append('cityCode', '-');

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'X-API-KEY': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: PopulationResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch population data: ${error.message}`);
    }
    throw new Error('Failed to fetch population data');
  }
}; 