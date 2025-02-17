'use client';

import { useEffect, useState } from 'react';
import { PrefectureList } from '@/components/features/prefecture/PrefectureList';
import { ChartSkeleton } from '@/components/features/chart/ChartSkeleton';
import { ChartErrorFallback } from '@/components/features/chart/ChartErrorFallback';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { usePrefectureData } from '@/hooks/usePrefectureData';
import { usePopulationData } from '@/hooks/usePopulationData';
import { usePrefectureSelection } from '@/hooks/usePrefectureSelection';
import { CacheIndicator } from '@/components/ui/CacheIndicator';
import { toAppError, createErrorState, isErrorCritical, isErrorRecoverable } from '@/utils/error';
import { FullscreenChart } from '@/components/features/chart/FullscreenChart';
import { PopulationTypeSelector, PopulationType } from '@/components/features/population/PopulationTypeSelector';

export default function Home() {
  // 都道府県データの取得
  const {
    data: prefectures,
    isLoading: isLoadingPrefectures,
    error: prefectureError,
    fetchData: fetchPrefectures,
  } = usePrefectureData();

  // 人口データの取得
  const {
    data: populationData,
    isLoading: isLoadingPopulation,
    error: populationError,
    fetchData: fetchPopulation,
    clearCache,
    fetchTimeMs,
    source,
  } = usePopulationData();

  // 都道府県選択の状態管理
  const {
    selectedPrefCodes,
    toggleSelection,
    selectAll,
    unselectAll,
  } = usePrefectureSelection();

  // 人口種別の状態管理
  const [selectedType, setSelectedType] = useState<PopulationType>('総人口');

  // コンポーネントマウント時に都道府県データを取得
  useEffect(() => {
    fetchPrefectures();
  }, [fetchPrefectures]);

  // 都道府県選択時の処理
  const handlePrefectureChange = async (prefCode: number, checked: boolean) => {
    toggleSelection(prefCode, checked);
    if (checked) {
      await fetchPopulation(prefCode);
    }
  };

  // 全選択時の処理
  const handleSelectAll = async () => {
    await selectAll(fetchPopulation);
  };

  // 選択された都道府県の人口データを抽出
  const selectedPopulationData = selectedPrefCodes
    .filter(prefCode => populationData.has(prefCode))
    .map(prefCode => {
      const data = populationData.get(prefCode);
      if (!data) return null;

      // 選択された人口種別のデータを使用
      const populationTypeData = data.result.data.find(d => d.label === selectedType);
      if (!populationTypeData) return null;

      return {
        prefCode,
        data: {
          boundaryYear: data.result.boundaryYear,
          data: [populationTypeData],
        }
      };
    })
    .filter((data): data is NonNullable<typeof data> => data !== null);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* エラー表示 */}
      {(prefectureError || populationError) && (() => {
        const error = prefectureError
          ? createErrorState(toAppError(prefectureError).code)
          : populationError
          ? createErrorState(toAppError(populationError).code)
          : null;

        if (!error) return null;

        return (
          <div className="mb-4">
            <ErrorDisplay
              error={error}
              errorMessage={prefectureError?.message || populationError?.message || '予期せぬエラーが発生しました'}
              isCritical={isErrorCritical(error)}
              isRecoverable={isErrorRecoverable(error)}
              onClear={() => {
                // エラーをクリアする処理
                if (prefectureError) {
                  fetchPrefectures();
                }
                if (populationError) {
                  clearCache();
                }
              }}
            />
          </div>
        );
      })()}

      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-8 mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">都道府県別人口推移グラフ</h1>
        <div className="flex items-center justify-end gap-3 sm:gap-4">
          <CacheIndicator
            source={source}
            fetchTimeMs={fetchTimeMs}
            isLoading={isLoadingPopulation}
          />
          <button
            onClick={() => {
              clearCache();
              unselectAll();
            }}
            className="shrink-0 h-8 px-3 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
          >
            キャッシュクリア
          </button>
        </div>
      </div>

      {/* 都道府県選択 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">都道府県を選択</h2>
        <PrefectureList
          prefectures={prefectures}
          selectedPrefCodes={selectedPrefCodes}
          onPrefectureChange={handlePrefectureChange}
          onSelectAll={handleSelectAll}
          onUnselectAll={unselectAll}
          isLoading={isLoadingPrefectures}
        />
      </section>

      {/* 人口グラフ */}
      <section>
        <h2 className="text-2xl font-bold mb-4">人口推移グラフ</h2>
        
        {/* 人口種別選択 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">表示する人口データを選択</h3>
          <PopulationTypeSelector
            selectedType={selectedType}
            onTypeChange={setSelectedType}
          />
        </div>

        {isLoadingPopulation ? (
          <ChartSkeleton />
        ) : populationError ? (
          <ChartErrorFallback />
        ) : selectedPopulationData.length > 0 ? (
          <FullscreenChart
            prefectures={prefectures}
            populationData={selectedPopulationData}
            selectedType={selectedType}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            都道府県を選択してください
          </div>
        )}
      </section>
    </main>
  );
}
