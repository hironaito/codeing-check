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

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="loading-spinner" />
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="card bg-red-50 text-red-700">
        <h2>エラーが発生しました</h2>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-8 animate-fade-in">
      <h1 className="text-gradient">都道府県一覧</h1>
      <div className="card">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {prefectures.map((pref) => (
            <button
              key={pref.prefCode}
              onClick={() => handlePrefectureClick(pref.prefCode)}
              className="btn btn-secondary"
            >
              {pref.prefName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 