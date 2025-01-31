export const API_ENDPOINTS = {
  PREFECTURES: '/api/v1/prefectures',
  POPULATION: '/api/v1/population/composition/perYear',
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