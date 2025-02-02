'use client';

import { useEffect } from 'react';
import { PrefectureList } from '@/components/features/prefecture/PrefectureList';
import { PopulationChart } from '@/components/features/chart/PopulationChart';
import { ChartSkeleton } from '@/components/features/chart/ChartSkeleton';
import { ChartErrorFallback } from '@/components/features/chart/ChartErrorFallback';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { usePrefectureData } from '@/hooks/usePrefectureData';
import { usePopulationData } from '@/hooks/usePopulationData';
import { usePrefectureSelection } from '@/hooks/usePrefectureSelection';

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

      // 総人口のデータのみを使用
      const totalPopulation = data.result.data.find(d => d.label === '総人口');
      if (!totalPopulation) return null;

      return {
        prefCode,
        data: {
          boundaryYear: data.result.boundaryYear,
          data: [totalPopulation],
        }
      };
    })
    .filter((data): data is NonNullable<typeof data> => data !== null);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* エラー表示 */}
      {(prefectureError || populationError) && (
        <div className="mb-4">
          <ErrorDisplay />
        </div>
      )}

      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">都道府県別人口推移グラフ</h1>
        <div className="flex items-center space-x-4">
          {fetchTimeMs !== null && (
            <span className="text-sm text-gray-500">
              取得時間: {fetchTimeMs}ms
              {source && <span className="ml-1">({source === 'cache' ? 'キャッシュ' : 'API'})</span>}
            </span>
          )}
          <button
            onClick={clearCache}
            className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
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
        {isLoadingPopulation ? (
          <ChartSkeleton />
        ) : populationError ? (
          <ChartErrorFallback />
        ) : selectedPopulationData.length > 0 ? (
          <PopulationChart
            prefectures={prefectures}
            populationData={selectedPopulationData}
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
