/**
 * API設定
 */
export const API_CONFIG = {
  TIMEOUT: {
    DEFAULT: 5000,
    LONG: 10000,
  },
  RETRY: {
    MAX_COUNT: 3,
    DELAY: 1000,
    STATUS_CODES: [408, 429, 500, 502, 503, 504],
  },
  CACHE: {
    PREFIX: 'api_cache_',
    DEFAULT_TTL: 1000 * 60 * 5, // 5分
    PREFECTURE_TTL: 1000 * 60 * 60 * 24, // 24時間
    POPULATION_TTL: 1000 * 60 * 60, // 1時間
  },
  version: '/api/v1',
  endpoints: {
    population: {
      composition: {
        perYear: '/population/composition/perYear',
      },
    },
  },
} as const;

/**
 * APIエンドポイント
 */
export const API_ENDPOINTS = {
  PREFECTURES: '/api/v1/prefectures',
  POPULATION: {
    COMPOSITION: `${API_CONFIG.version}${API_CONFIG.endpoints.population.composition.perYear}`,
  },
} as const;

export const API_ERROR_MESSAGES = {
  BAD_REQUEST: 'リクエストが不正です',
  UNAUTHORIZED: 'APIキーが無効です',
  NOT_FOUND: 'リソースが見つかりません',
  SERVER_ERROR: 'サーバーエラーが発生しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  TIMEOUT: 'リクエストがタイムアウトしました',
  UNKNOWN: '予期せぬエラーが発生しました',
} as const; 