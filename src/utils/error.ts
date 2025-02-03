import { z } from 'zod';
import { APIError } from '@/types/api/error';
import { ErrorCode, ErrorMessage, AppError, ErrorState } from '@/types/error';

/**
 * APIエラーを適切に処理する共通関数
 * @param error エラーオブジェクト
 * @param customMessage カスタムエラーメッセージ
 * @throws {APIError} 適切に変換されたAPIエラー
 */
export const handleAPIError = (error: unknown, customMessage: string): never => {
  console.log(`🔍 テスト検証中のエラー - ${customMessage}:`, error);
  
  if (error instanceof APIError) {
    throw error;
  }
  
  if (error instanceof z.ZodError) {
    throw new APIError('レスポンスの形式が不正です', 500);
  }
  
  throw new APIError(customMessage);
};

/**
 * エラーをAppErrorに変換
 */
export const toAppError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // ネットワークエラーの判定
    if (error.name === 'NetworkError' || error.message.toLowerCase().includes('network')) {
      return new AppError(ErrorCode.NETWORK_ERROR, error);
    }
    
    // タイムアウトエラーの判定
    if (error.name === 'TimeoutError' || error.message.toLowerCase().includes('timeout')) {
      return new AppError(ErrorCode.TIMEOUT_ERROR, error);
    }

    return new AppError(ErrorCode.UNKNOWN_ERROR, error);
  }

  return new AppError(ErrorCode.UNKNOWN_ERROR);
};

/**
 * エラー状態オブジェクトの作成
 */
export const createErrorState = (
  code: ErrorCode,
  details?: unknown
): ErrorState => ({
  code,
  message: ErrorMessage[code],
  timestamp: Date.now(),
  details,
});

/**
 * エラーメッセージのフォーマット
 */
export const formatErrorMessage = (error: ErrorState): string => {
  const baseMessage = error.message;
  if (error.details && typeof error.details === 'string') {
    return `${baseMessage}: ${error.details}`;
  }
  return baseMessage;
};

/**
 * エラーの重大度判定
 */
export const isErrorCritical = (error: ErrorState): boolean => {
  return [
    ErrorCode.NETWORK_ERROR,
    ErrorCode.STATE_UPDATE_FAILED,
    ErrorCode.INVALID_STATE_TRANSITION,
  ].includes(error.code);
};

/**
 * エラーの永続化（必要に応じてエラーログを保存）
 */
export const persistError = (error: ErrorState): void => {
  if (isErrorCritical(error)) {
    // 重大なエラーの場合、コンソールに出力
    console.error('[Critical Error]', {
      code: error.code,
      message: error.message,
      timestamp: new Date(error.timestamp).toISOString(),
      details: error.details,
    });
  }
};

/**
 * エラー状態の初期化
 */
export const initializeErrorState = (): ErrorState | null => null;

/**
 * エラーのリカバリーが可能かどうかの判定
 */
export const isErrorRecoverable = (error: ErrorState): boolean => {
  return ![
    ErrorCode.INVALID_DATA_FORMAT,
    ErrorCode.INVALID_STATE_TRANSITION,
  ].includes(error.code);
};

/**
 * エラー状態の集約（複数のエラーを1つにまとめる）
 */
export const aggregateErrors = (errors: ErrorState[]): ErrorState => {
  if (errors.length === 0) {
    return createErrorState(ErrorCode.UNKNOWN_ERROR);
  }

  if (errors.length === 1) {
    return errors[0];
  }

  return {
    code: ErrorCode.UNKNOWN_ERROR,
    message: `複数のエラーが発生しました (${errors.length}件)`,
    timestamp: Date.now(),
    details: errors,
  };
}; 