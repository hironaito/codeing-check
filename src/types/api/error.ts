import { API_ERROR_MESSAGES } from '@/constants/api';

/**
 * APIエラーを表すカスタムエラークラス
 */
export class APIError extends Error {
  constructor(
    message: string,
    /** HTTPステータスコード */
    public status?: number,
    /** エラーコード文字列 */
    public code?: string,
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * APIエラーメッセージの型
 * @see API_ERROR_MESSAGES
 */
export type APIErrorType = typeof API_ERROR_MESSAGES[keyof typeof API_ERROR_MESSAGES];

/**
 * APIエラーレスポンスの型
 * RESAS APIのエラーレスポンス形式に準拠
 */
export interface ErrorResponse {
  /** エラーメッセージ */
  message: string;
  /** HTTPステータスコード */
  statusCode: number;
} 