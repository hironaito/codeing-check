import { ZodError } from 'zod';
import { APIError } from '@/types/api/error';
import { ErrorCode, AppError, ErrorState } from '@/types/error';
import {
  handleAPIError,
  toAppError,
  createErrorState,
  formatErrorMessage,
  isErrorCritical,
  persistError,
  initializeErrorState,
  isErrorRecoverable,
  aggregateErrors,
} from '../error';

describe('Error Utilities', () => {
  describe('handleAPIError', () => {
    it('APIErrorをそのまま再スローすること', () => {
      const apiError = new APIError('テストエラー', 400);
      expect(() => handleAPIError(apiError, 'カスタムメッセージ')).toThrow(apiError);
    });

    it('ZodErrorをAPIErrorに変換して再スローすること', () => {
      const zodError = new ZodError([{
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
        path: ['test'],
        message: 'Expected string, received number'
      }]);
      expect(() => handleAPIError(zodError, 'カスタムメッセージ')).toThrow(APIError);
      expect(() => handleAPIError(zodError, 'カスタムメッセージ')).toThrow('レスポンスの形式が不正です');
    });

    it('その他のエラーをカスタムメッセージ付きのAPIErrorに変換すること', () => {
      const error = new Error('一般的なエラー');
      expect(() => handleAPIError(error, 'カスタムメッセージ')).toThrow('カスタムメッセージ');
    });
  });

  describe('toAppError', () => {
    it('AppErrorをそのまま返すこと', () => {
      const appError = new AppError(ErrorCode.UNKNOWN_ERROR);
      const result = toAppError(appError);
      expect(result).toBe(appError);
    });

    it('ネットワークエラーを適切に変換すること', () => {
      const networkError = new Error('Network error occurred');
      networkError.name = 'NetworkError';
      const result = toAppError(networkError);
      expect(result.code).toBe(ErrorCode.NETWORK_ERROR);
      expect(result.originalError).toBe(networkError);
    });

    it('タイムアウトエラーを適切に変換すること', () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      const result = toAppError(timeoutError);
      expect(result.code).toBe(ErrorCode.TIMEOUT_ERROR);
      expect(result.originalError).toBe(timeoutError);
    });

    it('不明なエラーを適切に変換すること', () => {
      const unknownError = new Error('Unknown error');
      const result = toAppError(unknownError);
      expect(result.code).toBe(ErrorCode.UNKNOWN_ERROR);
      expect(result.originalError).toBe(unknownError);
    });
  });

  describe('createErrorState', () => {
    it('基本的なエラー状態を作成すること', () => {
      const result = createErrorState(ErrorCode.NETWORK_ERROR);
      expect(result).toEqual({
        code: ErrorCode.NETWORK_ERROR,
        message: expect.any(String),
        timestamp: expect.any(Number),
        details: undefined,
      });
    });

    it('詳細情報付きのエラー状態を作成すること', () => {
      const details = { additionalInfo: 'テスト' };
      const result = createErrorState(ErrorCode.NETWORK_ERROR, details);
      expect(result.details).toEqual(details);
    });
  });

  describe('formatErrorMessage', () => {
    it('基本的なエラーメッセージをフォーマットすること', () => {
      const error: ErrorState = {
        code: ErrorCode.NETWORK_ERROR,
        message: 'ネットワークエラー',
        timestamp: Date.now(),
      };
      expect(formatErrorMessage(error)).toBe('ネットワークエラー');
    });

    it('詳細情報付きのエラーメッセージをフォーマットすること', () => {
      const error: ErrorState = {
        code: ErrorCode.NETWORK_ERROR,
        message: 'ネットワークエラー',
        timestamp: Date.now(),
        details: '接続タイムアウト',
      };
      expect(formatErrorMessage(error)).toBe('ネットワークエラー: 接続タイムアウト');
    });
  });

  describe('isErrorCritical', () => {
    it('重大なエラーを正しく判定すること', () => {
      const criticalError: ErrorState = {
        code: ErrorCode.NETWORK_ERROR,
        message: 'ネットワークエラー',
        timestamp: Date.now(),
      };
      expect(isErrorCritical(criticalError)).toBe(true);
    });

    it('非重大なエラーを正しく判定すること', () => {
      const nonCriticalError: ErrorState = {
        code: ErrorCode.CACHE_ERROR,
        message: 'キャッシュエラー',
        timestamp: Date.now(),
      };
      expect(isErrorCritical(nonCriticalError)).toBe(false);
    });
  });

  describe('persistError', () => {
    let consoleErrorMock: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorMock = jest.spyOn(console, 'error').mockImplementation((...args) => {
        console.log('✓ テスト用エラーログ:', ...args);
      });
    });

    afterEach(() => {
      consoleErrorMock.mockRestore();
    });

    it('重大なエラーをコンソールに出力すること', () => {
      const criticalError: ErrorState = {
        code: ErrorCode.NETWORK_ERROR,
        message: 'ネットワークエラー',
        timestamp: Date.now(),
      };
      persistError(criticalError);
      expect(consoleErrorMock).toHaveBeenCalled();
    });

    it('非重大なエラーはコンソールに出力しないこと', () => {
      const nonCriticalError: ErrorState = {
        code: ErrorCode.CACHE_ERROR,
        message: 'キャッシュエラー',
        timestamp: Date.now(),
      };
      persistError(nonCriticalError);
      expect(consoleErrorMock).not.toHaveBeenCalled();
    });
  });

  describe('initializeErrorState', () => {
    it('nullを返すこと', () => {
      expect(initializeErrorState()).toBeNull();
    });
  });

  describe('isErrorRecoverable', () => {
    it('リカバリー可能なエラーを正しく判定すること', () => {
      const recoverableError: ErrorState = {
        code: ErrorCode.NETWORK_ERROR,
        message: 'ネットワークエラー',
        timestamp: Date.now(),
      };
      expect(isErrorRecoverable(recoverableError)).toBe(true);
    });

    it('リカバリー不可能なエラーを正しく判定すること', () => {
      const unrecoverableError: ErrorState = {
        code: ErrorCode.INVALID_DATA_FORMAT,
        message: 'データ形式エラー',
        timestamp: Date.now(),
      };
      expect(isErrorRecoverable(unrecoverableError)).toBe(false);
    });
  });

  describe('aggregateErrors', () => {
    it('空の配列の場合は不明なエラーを返すこと', () => {
      const result = aggregateErrors([]);
      expect(result.code).toBe(ErrorCode.UNKNOWN_ERROR);
    });

    it('1つのエラーの場合はそのエラーをそのまま返すこと', () => {
      const error: ErrorState = {
        code: ErrorCode.NETWORK_ERROR,
        message: 'ネットワークエラー',
        timestamp: Date.now(),
      };
      const result = aggregateErrors([error]);
      expect(result).toBe(error);
    });

    it('複数のエラーを適切に集約すること', () => {
      const errors: ErrorState[] = [
        {
          code: ErrorCode.NETWORK_ERROR,
          message: 'ネットワークエラー',
          timestamp: Date.now(),
        },
        {
          code: ErrorCode.CACHE_ERROR,
          message: 'キャッシュエラー',
          timestamp: Date.now(),
        },
      ];
      const result = aggregateErrors(errors);
      expect(result.code).toBe(ErrorCode.UNKNOWN_ERROR);
      expect(result.message).toContain('2件');
      expect(result.details).toEqual(errors);
    });
  });
}); 