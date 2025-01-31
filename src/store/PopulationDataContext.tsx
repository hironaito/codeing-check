'use client';

import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { PopulationResponse, PopulationComposition } from '@/types/api/population';
import { fetchPopulationData } from '@/services/api/population';
import { cacheStore } from '@/utils/cache';

// 状態の型定義
interface PopulationState {
  data: Record<number, PopulationResponse>;
  isLoading: boolean;
  error: Error | null;
  selectedPrefCodes: number[];
}

// アクション型の定義
type PopulationAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { prefCode: number; data: PopulationResponse } }
  | { type: 'FETCH_ERROR'; payload: Error }
  | { type: 'SELECT_PREFECTURE'; payload: number }
  | { type: 'DESELECT_PREFECTURE'; payload: number }
  | { type: 'CLEAR_ALL' };

// 初期状態
const initialState: PopulationState = {
  data: {},
  isLoading: false,
  error: null,
  selectedPrefCodes: [],
};

// Reducer
const populationReducer = (state: PopulationState, action: PopulationAction): PopulationState => {
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
        data: {
          ...state.data,
          [action.payload.prefCode]: action.payload.data,
        },
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'SELECT_PREFECTURE':
      return {
        ...state,
        selectedPrefCodes: [...state.selectedPrefCodes, action.payload],
      };
    case 'DESELECT_PREFECTURE':
      return {
        ...state,
        selectedPrefCodes: state.selectedPrefCodes.filter(code => code !== action.payload),
      };
    case 'CLEAR_ALL':
      return initialState;
    default:
      return state;
  }
};

// Context
const PopulationDataContext = createContext<{
  state: PopulationState;
  fetchPopulationDataForPrefecture: (prefCode: number) => Promise<void>;
  selectPrefecture: (prefCode: number) => Promise<void>;
  deselectPrefecture: (prefCode: number) => void;
  clearAll: () => void;
  getPopulationDataByType: (prefCode: number, type: string) => PopulationComposition | null;
} | null>(null);

// Provider Component
export const PopulationDataProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(populationReducer, initialState);

  const fetchPopulationDataForPrefecture = useCallback(async (prefCode: number) => {
    const cacheKey = `population_${prefCode}`;
    const cachedData = cacheStore.get<PopulationResponse>(cacheKey);

    if (cachedData) {
      dispatch({ type: 'FETCH_SUCCESS', payload: { prefCode, data: cachedData } });
      return;
    }

    try {
      dispatch({ type: 'FETCH_START' });
      const data = await fetchPopulationData(prefCode);
      cacheStore.set(cacheKey, data);
      dispatch({ type: 'FETCH_SUCCESS', payload: { prefCode, data } });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error instanceof Error ? error : new Error('Unknown error') });
    }
  }, []);

  const selectPrefecture = useCallback(async (prefCode: number) => {
    if (!state.data[prefCode]) {
      await fetchPopulationDataForPrefecture(prefCode);
    }
    dispatch({ type: 'SELECT_PREFECTURE', payload: prefCode });
  }, [state.data, fetchPopulationDataForPrefecture]);

  const deselectPrefecture = useCallback((prefCode: number) => {
    dispatch({ type: 'DESELECT_PREFECTURE', payload: prefCode });
  }, []);

  const clearAll = useCallback(() => {
    cacheStore.clear();
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const getPopulationDataByType = useCallback((prefCode: number, type: string): PopulationComposition | null => {
    const prefData = state.data[prefCode]?.result.data;
    if (!prefData) return null;
    return prefData.find(item => item.label === type) || null;
  }, [state.data]);

  return (
    <PopulationDataContext.Provider
      value={{
        state,
        fetchPopulationDataForPrefecture,
        selectPrefecture,
        deselectPrefecture,
        clearAll,
        getPopulationDataByType,
      }}
    >
      {children}
    </PopulationDataContext.Provider>
  );
};

// Custom Hook
export const usePopulationDataContext = () => {
  const context = useContext(PopulationDataContext);
  if (!context) {
    throw new Error('usePopulationDataContext must be used within a PopulationDataProvider');
  }
  return context;
}; 