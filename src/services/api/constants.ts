export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  INVALID_RESPONSE: '不正なレスポンスを受信しました',
  NOT_FOUND: 'リソースが見つかりません',
  INTERNAL_SERVER_ERROR: 'サーバーエラーが発生しました',
  UNKNOWN: '予期せぬエラーが発生しました',
  RATE_LIMIT: 'APIのリクエスト制限に達しました',
  UNAUTHORIZED: '認証に失敗しました',
  API_DEPRECATED: 'このAPIは現在利用できません',
} as const;

// APIエンドポイント
export const API_ENDPOINTS = {
  PREFECTURES: '/prefectures',
  POPULATION: '/population/composition/perYear',
} as const; 