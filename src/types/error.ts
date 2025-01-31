/**
 * アプリケーションのエラーコード
 */
export enum ErrorCode {
  // API関連エラー
  API_REQUEST_FAILED = 'API_REQUEST_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // データ関連エラー
  INVALID_DATA_FORMAT = 'INVALID_DATA_FORMAT',
  DATA_NOT_FOUND = 'DATA_NOT_FOUND',
  CACHE_ERROR = 'CACHE_ERROR',

  // バリデーションエラー
  INVALID_PREFECTURE_CODE = 'INVALID_PREFECTURE_CODE',
  INVALID_YEAR_RANGE = 'INVALID_YEAR_RANGE',
  
  // 状態管理エラー
  STATE_UPDATE_FAILED = 'STATE_UPDATE_FAILED',
  INVALID_STATE_TRANSITION = 'INVALID_STATE_TRANSITION',

  // その他
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * アプリケーションのエラーメッセージ
 */
export const ErrorMessage: Record<ErrorCode, string> = {
  [ErrorCode.API_REQUEST_FAILED]: 'APIリクエストに失敗しました',
  [ErrorCode.NETWORK_ERROR]: 'ネットワークエラーが発生しました',
  [ErrorCode.TIMEOUT_ERROR]: 'リクエストがタイムアウトしました',
  
  [ErrorCode.INVALID_DATA_FORMAT]: 'データ形式が不正です',
  [ErrorCode.DATA_NOT_FOUND]: 'データが見つかりません',
  [ErrorCode.CACHE_ERROR]: 'キャッシュの操作に失敗しました',

  [ErrorCode.INVALID_PREFECTURE_CODE]: '無効な都道府県コードです',
  [ErrorCode.INVALID_YEAR_RANGE]: '無効な年範囲が指定されました',
  
  [ErrorCode.STATE_UPDATE_FAILED]: '状態の更新に失敗しました',
  [ErrorCode.INVALID_STATE_TRANSITION]: '無効な状態遷移が発生しました',

  [ErrorCode.UNKNOWN_ERROR]: '予期せぬエラーが発生しました'
};

/**
 * アプリケーションのエラークラス
 */
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public originalError?: Error
  ) {
    super(ErrorMessage[code]);
    this.name = 'AppError';
  }
}

/**
 * エラー状態の型定義
 */
export interface ErrorState {
  code: ErrorCode;
  message: string;
  timestamp: number;
  details?: unknown;
} 