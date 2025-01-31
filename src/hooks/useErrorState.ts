import { useState, useCallback } from 'react';
import { ErrorState, ErrorCode } from '@/types/error';
import {
  createErrorState,
  toAppError,
  formatErrorMessage,
  isErrorCritical,
  persistError,
  isErrorRecoverable,
} from '@/utils/error';

export interface UseErrorState {
  error: ErrorState | null;
  setError: (error: unknown) => void;
  clearError: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  handleError: (error: unknown) => void;
  errorMessage: string | null;
  isRecoverable: boolean;
  isCritical: boolean;
}

/**
 * エラー状態を管理するカスタムフック
 */
export const useErrorState = (): UseErrorState => {
  const [error, setErrorState] = useState<ErrorState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // エラー状態のセット
  const setError = useCallback((err: unknown) => {
    const appError = toAppError(err);
    const errorState = createErrorState(appError.code, appError.originalError?.message);
    setErrorState(errorState);
    persistError(errorState);
  }, []);

  // エラー状態のクリア
  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  // エラーハンドリング
  const handleError = useCallback((err: unknown) => {
    setIsLoading(false);
    setError(err);
  }, [setError]);

  // エラーメッセージの取得
  const errorMessage = error ? formatErrorMessage(error) : null;

  // エラーの回復可否判定
  const isRecoverable = error ? isErrorRecoverable(error) : true;

  // エラーの重大度判定
  const isCritical = error ? isErrorCritical(error) : false;

  return {
    error,
    setError,
    clearError,
    isLoading,
    setIsLoading,
    handleError,
    errorMessage,
    isRecoverable,
    isCritical,
  };
};

/**
 * エラー状態を監視するカスタムフック
 */
export const useErrorStateWithCallback = (
  onError?: (error: ErrorState) => void
): UseErrorState => {
  const errorState = useErrorState();

  const setError = useCallback((err: unknown) => {
    errorState.setError(err);
    if (errorState.error && onError) {
      onError(errorState.error);
    }
  }, [errorState, onError]);

  return {
    ...errorState,
    setError,
  };
}; 