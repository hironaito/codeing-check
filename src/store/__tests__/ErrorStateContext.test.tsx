import React from 'react';
import { render, renderHook, act } from '@testing-library/react';
import { ErrorStateProvider, useErrorStateContext } from '../ErrorStateContext';

describe('ErrorStateContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ErrorStateProvider>{children}</ErrorStateProvider>
  );

  it('should throw error when used outside of provider', () => {
    expect(() => {
      renderHook(() => useErrorStateContext());
    }).toThrow('useErrorStateContext must be used within an ErrorStateProvider');
  });

  it('should set and clear error state', () => {
    const { result } = renderHook(() => useErrorStateContext(), { wrapper });

    // 初期状態の確認
    expect(result.current.error).toBeNull();
    expect(result.current.errorMessage).toBeNull();

    // エラーの設定
    const testError = new Error('Test error');
    act(() => {
      result.current.setError(testError);
    });

    // エラー状態の確認
    expect(result.current.error).toBeTruthy();
    expect(result.current.errorMessage).toBe('予期せぬエラーが発生しました: Test error');

    // エラーのクリア
    act(() => {
      result.current.clearError();
    });

    // クリア後の状態確認
    expect(result.current.error).toBeNull();
    expect(result.current.errorMessage).toBeNull();
  });

  it('should provide error state to children', () => {
    const TestComponent = () => {
      const { setError, errorMessage } = useErrorStateContext();
      return (
        <div>
          <span data-testid="error-message">{errorMessage}</span>
          <button
            onClick={() => setError(new Error('Test error'))}
            data-testid="set-error-button"
          >
            Set Error
          </button>
        </div>
      );
    };

    const { getByTestId } = render(
      <ErrorStateProvider>
        <TestComponent />
      </ErrorStateProvider>
    );

    // 初期状態の確認
    expect(getByTestId('error-message').textContent).toBe('');

    // エラーの設定
    act(() => {
      getByTestId('set-error-button').click();
    });

    // エラーメッセージの確認
    expect(getByTestId('error-message').textContent).toBe('予期せぬエラーが発生しました: Test error');
  });
});
