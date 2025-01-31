'use client';

import { PrefectureList } from '@/components/features/prefecture/PrefectureList';
import { ChartSkeleton } from '@/components/features/chart/ChartSkeleton';
import { usePrefectureSelection } from '@/hooks/usePrefectureSelection';

// 仮の都道府県データ
const mockPrefectures = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 2, prefName: '青森県' },
  { prefCode: 3, prefName: '岩手県' },
  { prefCode: 4, prefName: '宮城県' },
  { prefCode: 5, prefName: '秋田県' },
  { prefCode: 6, prefName: '山形県' },
  { prefCode: 7, prefName: '福島県' },
  // ... 他の都道府県
];

export default function Home() {
  const {
    selectedPrefCodes,
    toggleSelection,
    selectAll,
    unselectAll,
  } = usePrefectureSelection();

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* ヘッダー */}
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">都道府県別人口推移グラフ</h1>
        <p className="text-sm text-gray-600">
          都道府県を選択すると、人口推移グラフが表示されます。
        </p>
      </header>

      {/* メインコンテンツ */}
      <div className="grid gap-8">
        {/* 都道府県選択 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">都道府県を選択</h2>
          <div className="bg-white rounded-lg shadow-sm">
            <PrefectureList
              prefectures={mockPrefectures}
              selectedPrefCodes={selectedPrefCodes}
              onPrefectureChange={toggleSelection}
              onSelectAll={selectAll}
              onUnselectAll={unselectAll}
            />
          </div>
        </section>

        {/* グラフ表示エリア */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">人口推移グラフ</h2>
          <div className="bg-white rounded-lg shadow-sm">
            <ChartSkeleton
              variant="empty"
              lineCount={selectedPrefCodes.length || 1}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
