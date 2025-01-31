'use client';

import { useEffect, useState } from 'react';
import { getPrefectures } from '@/services/api/prefectureApi';
import { getPopulation } from '@/services/api/populationApi';
import type { Prefecture } from '@/types/api/prefecture';

export default function TestPage() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPrefectures = async () => {
      try {
        setLoading(true);
        const data = await getPrefectures();
        setPrefectures(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchPrefectures();
  }, []);

  const handlePrefectureClick = async (prefCode: number) => {
    try {
      const data = await getPopulation(prefCode);
      console.log('人口データ:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">都道府県一覧</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {prefectures.map((pref) => (
          <button
            key={pref.prefCode}
            onClick={() => handlePrefectureClick(pref.prefCode)}
            className="p-2 border rounded hover:bg-gray-100"
          >
            {pref.prefName}
          </button>
        ))}
      </div>
    </div>
  );
} 