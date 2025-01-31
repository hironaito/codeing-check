'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useErrorState, UseErrorState } from '@/hooks/useErrorState';

// エラー状態管理コンテキスト
const ErrorStateContext = createContext<UseErrorState | null>(null);

// プロバイダーコンポーネント
export const ErrorStateProvider = ({ children }: { children: ReactNode }) => {
  const errorState = useErrorState();

  return (
    <ErrorStateContext.Provider value={errorState}>
      {children}
    </ErrorStateContext.Provider>
  );
};

// カスタムフック
export const useErrorStateContext = () => {
  const context = useContext(ErrorStateContext);
  if (!context) {
    throw new Error('useErrorStateContext must be used within an ErrorStateProvider');
  }
  return context;
}; 