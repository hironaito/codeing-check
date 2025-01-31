import { Prefecture } from '@/types/api/prefecture';
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
 * 都道府県一覧を取得する
 */
export const fetchPrefectures = async (): Promise<Prefecture[]> => {
  const { apiEndpoint, apiKey } = getAPIConfig();
  const url = new URL(`${apiEndpoint}/api/v1/prefectures`);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'X-API-KEY': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch prefectures: ${error.message}`);
    }
    throw new Error('Failed to fetch prefectures');
  }
}; 