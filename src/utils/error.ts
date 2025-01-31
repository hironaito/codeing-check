import { z } from 'zod';
import { APIError } from '@/types/api/error';

/**
 * APIエラーを適切に処理する共通関数
 * @param error エラーオブジェクト
 * @param customMessage カスタムエラーメッセージ
 * @throws {APIError} 適切に変換されたAPIエラー
 */
export const handleAPIError = (error: unknown, customMessage: string): never => {
  console.error(`${customMessage}:`, error);
  
  if (error instanceof APIError) {
    throw error;
  }
  
  if (error instanceof z.ZodError) {
    throw new APIError('レスポンスの形式が不正です', 500);
  }
  
  throw new APIError(customMessage);
}; 