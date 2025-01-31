'use client';

import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { Prefecture } from '@/types/api/prefecture';
import { fetchPrefectures } from '@/services/api/prefecture';

// 状態の型定義
interface PrefectureState {
  prefectures: Prefecture[];
  isLoading: boolean;
  error: Error | null;
}

// アクション型の定義
type PrefectureAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Prefecture[] }
  | { type: 'FETCH_ERROR'; payload: Error }
  | { type: 'CLEAR' };

// 初期状態
const initialState: PrefectureState = {
  prefectures: [],
  isLoading: false,
  error: null,
};

// Reducer
const prefectureReducer = (state: PrefectureState, action: PrefectureAction): PrefectureState => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        prefectures: action.payload,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
};

// Context
const PrefectureDataContext = createContext<{
  state: PrefectureState;
  fetchPrefectures: () => Promise<void>;
  getPrefectureById: (prefCode: number) => Prefecture | undefined;
  clearPrefectures: () => void;
} | null>(null);

// Provider Component
export const PrefectureDataProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(prefectureReducer, initialState);

  const fetchPrefecturesData = useCallback(async () => {
    try {
      dispatch({ type: 'FETCH_START' });
      const data = await fetchPrefectures();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error instanceof Error ? error : new Error('Unknown error') });
    }
  }, []);

  const getPrefectureById = useCallback((prefCode: number) => {
    return state.prefectures.find(pref => pref.prefCode === prefCode);
  }, [state.prefectures]);

  const clearPrefectures = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  return (
    <PrefectureDataContext.Provider
      value={{
        state,
        fetchPrefectures: fetchPrefecturesData,
        getPrefectureById,
        clearPrefectures,
      }}
    >
      {children}
    </PrefectureDataContext.Provider>
  );
};

// Custom Hook
export const usePrefectureDataContext = () => {
  const context = useContext(PrefectureDataContext);
  if (!context) {
    throw new Error('usePrefectureDataContext must be used within a PrefectureDataProvider');
  }
  return context;
}; 