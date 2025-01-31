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
    lastFetchTime,
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
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* エラー表示 */}
      <ErrorDisplay />

      {/* ヘッダー */}
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">都道府県別人口推移グラフ</h1>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            都道府県を選択すると、人口推移グラフが表示されます。複数の都道府県を選択して比較することができます。
          </p>
          <div className="flex items-center space-x-2">
            {fetchTimeMs !== null && (
              <span className="text-xs text-gray-500">
                取得時間: {fetchTimeMs}ms {source === 'cache' ? '(キャッシュ)' : '(API)'}
              </span>
            )}
            <button
              onClick={clearCache}
              className="px-3 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
            >
              キャッシュクリア
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="grid gap-8">
        {/* 都道府県選択 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">都道府県を選択</h2>
          <div className="bg-white rounded-lg shadow-sm">
            <PrefectureList
              prefectures={prefectures}
              selectedPrefCodes={selectedPrefCodes}
              onPrefectureChange={handlePrefectureChange}
              onSelectAll={selectAll}
              onUnselectAll={unselectAll}
              isLoading={isLoadingPrefectures}
            />
          </div>
        </section>

        {/* グラフ表示エリア */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">人口推移グラフ</h2>
          <div className="bg-white rounded-lg shadow-sm">
            {populationError ? (
              <ChartErrorFallback
                message="人口データの取得に失敗しました"
                onRetry={() => selectedPrefCodes.forEach(fetchPopulation)}
              />
            ) : isLoadingPopulation ? (
              <ChartSkeleton
                variant="loading"
                lineCount={selectedPrefCodes.length || 1}
              />
            ) : selectedPopulationData.length > 0 ? (
              <PopulationChart
                prefectures={prefectures}
                populationData={selectedPopulationData}
              />
            ) : (
              <ChartSkeleton
                variant="empty"
                lineCount={1}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
