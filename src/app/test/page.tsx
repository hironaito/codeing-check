'use client';

import { useEffect, useState } from 'react';
import { getPrefectures } from '@/services/api/prefectureApi';
import { getPopulation } from '@/services/api/populationApi';
import { clearCache } from '@/services/api/apiClient';
import type { Prefecture } from '@/types/api/prefecture';
import type { PopulationResponse } from '@/types/api/population';

export default function TestPage() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPref, setSelectedPref] = useState<Prefecture | null>(null);
  const [populationData, setPopulationData] = useState<PopulationResponse['result'] | null>(null);

  const fetchPrefectures = async () => {
    try {
      setLoading(true);
      setError(null);
      const start = performance.now();
      const data = await getPrefectures();
      const end = performance.now();
      console.log(`取得時間: ${end - start}ms`);
      setPrefectures(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const fetchPopulation = async (prefecture: Prefecture) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedPref(prefecture);
      const start = performance.now();
      const data = await getPopulation(prefecture.prefCode);
      const end = performance.now();
      console.log(`人口データ取得時間: ${end - start}ms`);
      setPopulationData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      setPopulationData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = () => {
    clearCache();
    setPopulationData(null);
    setSelectedPref(null);
    console.log('キャッシュをクリアしました');
  };

  useEffect(() => {
    fetchPrefectures();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">都道府県一覧API テスト</h1>
      
      <div className="flex gap-4 mb-4">
        <button
          onClick={fetchPrefectures}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? '読み込み中...' : '再取得'}
        </button>

        <button
          onClick={handleClearCache}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          キャッシュクリア
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
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
                  onClick={() => fetchPopulation(pref)}
                  className={`p-4 rounded shadow hover:shadow-md transition-all ${
                    selectedPref?.prefCode === pref.prefCode
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-white border-gray-200'
                  } border`}
                  disabled={loading}
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
          {selectedPref && populationData && (
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold text-lg mb-2">{selectedPref.prefName}の人口データ</h3>
              <p className="text-gray-600 mb-4">基準年: {populationData.boundaryYear}年</p>
              
              {populationData.data.map((composition) => (
                <div key={composition.label} className="mb-4">
                  <h4 className="font-bold">{composition.label}</h4>
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="px-4 py-2">年</th>
                          <th className="px-4 py-2">人口</th>
                        </tr>
                      </thead>
                      <tbody>
                        {composition.data.map((data) => (
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