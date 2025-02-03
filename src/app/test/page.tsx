'use client';

import { useEffect } from 'react';
import { useState } from 'react';
import { usePrefectureData } from '@/hooks/usePrefectureData';
import { usePopulationData } from '@/hooks/usePopulationData';
import type { Prefecture } from '@/types/api/prefecture';
import { PopulationComposition, PopulationData, PopulationResponse } from '@/types/api/population';

export default function TestPage() {
  const [selectedPref, setSelectedPref] = useState<Prefecture | null>(null);
  const [prefFetchTime, setPrefFetchTime] = useState<number | null>(null);
  const [popFetchTime, setPopFetchTime] = useState<number | null>(null);
  const [dataSource, setDataSource] = useState<'cache' | 'api' | null>(null);

  // 都道府県一覧取得フックを使用
  const {
    data: prefectures,
    isLoading: isLoadingPrefectures,
    error: prefectureError,
    fetchData: fetchPrefectureList,
    clearCache: clearPrefectureCache,
    source: prefSource,
  } = usePrefectureData();

  // 人口データ取得フックを使用
  const {
    data: populationData,
    isLoading: isLoadingPopulation,
    error: populationError,
    fetchData: fetchPopulation,
    clearCache: clearPopulationCache,
  } = usePopulationData();

  const handlePrefectureSelect = async (prefecture: Prefecture) => {
    try {
      setSelectedPref(prefecture);
      const start = performance.now();
      await fetchPopulation(prefecture.prefCode);
      const end = performance.now();
      setPopFetchTime(Math.round(end - start));
    } catch (err) {
      console.error('人口データの取得に失敗しました:', err);
    }
  };

  const handleClearCache = () => {
    try {
      clearPrefectureCache();
      clearPopulationCache();
      setSelectedPref(null);
      setPrefFetchTime(null);
      setPopFetchTime(null);
      setDataSource(null);
      console.log('全てのキャッシュをクリアしました');
    } catch (err) {
      console.error('キャッシュのクリアに失敗しました:', err);
    }
  };

  const handleFetchPrefectures = async () => {
    try {
      const start = performance.now();
      const source = await fetchPrefectureList();
      const end = performance.now();
      setPrefFetchTime(Math.round(end - start));
      setDataSource(source as 'cache' | 'api');
    } catch (err) {
      console.error('都道府県一覧の取得に失敗しました:', err);
    }
  };

  useEffect(() => {
    handleFetchPrefectures();
  }, []);

  // エラー状態の統合
  const displayError = prefectureError?.message || populationError?.message || null;
  // ローディング状態の統合
  const isLoadingAny = isLoadingPrefectures || isLoadingPopulation;

  // populationDataからデータを取得
  const populationResult = selectedPref ? populationData.get(selectedPref.prefCode) : null;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">都道府県一覧API テスト</h1>
      
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleFetchPrefectures}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isLoadingAny}
        >
          {isLoadingAny ? '読み込み中...' : '再取得'}
        </button>

        <button
          onClick={handleClearCache}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          キャッシュクリア
        </button>
      </div>

      {/* 取得時間の表示 */}
      <div className="mb-4 space-y-2">
        {prefFetchTime !== null && (
          <p className="text-sm text-gray-600">
            都道府県一覧取得時間: {prefFetchTime}ms
            {dataSource && ` (${dataSource === 'cache' ? 'キャッシュ' : 'API'}から取得)`}
          </p>
        )}
        {popFetchTime !== null && (
          <p className="text-sm text-gray-600">
            人口データ取得時間: {popFetchTime}ms
          </p>
        )}
      </div>

      {displayError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{displayError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">都道府県一覧</h2>
          {prefectures.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {prefectures.map((pref) => (
                <button
                  key={pref.prefCode}
                  onClick={() => handlePrefectureSelect(pref)}
                  className={`p-4 rounded shadow hover:shadow-md transition-all ${
                    selectedPref?.prefCode === pref.prefCode
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-white border-gray-200'
                  } border`}
                  disabled={isLoadingAny}
                >
                  <p className="font-bold">{pref.prefName}</p>
                  <p className="text-gray-600 text-sm">コード: {pref.prefCode}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">人口データ</h2>
          {selectedPref && populationResult && (
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold text-lg mb-2">{selectedPref.prefName}の人口データ</h3>
              <p className="text-gray-600 mb-4">基準年: {populationResult.result.boundaryYear}年</p>
              
              {populationResult.result.data.map((composition: PopulationComposition) => (
                <div key={composition.label} className="mb-4">
                  <h4 className="font-bold">{composition.label}</h4>
                  <div className="max-h-60 overflow-y-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="border px-4 py-2">年</th>
                          <th className="border px-4 py-2">人口</th>
                        </tr>
                      </thead>
                      <tbody>
                        {composition.data.map((data: PopulationData) => (
                          <tr key={data.year}>
                            <td className="border px-4 py-2">{data.year}年</td>
                            <td className="border px-4 py-2">{data.value.toLocaleString()}人</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 