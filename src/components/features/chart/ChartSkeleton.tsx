'use client';

import { FC } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Loader2 } from 'lucide-react';

interface ChartSkeletonProps {
  className?: string;
  variant?: 'loading' | 'empty';
  lineCount?: number;
  data?: Array<{ [key: string]: number }>;
}

export const ChartSkeleton: FC<ChartSkeletonProps> = ({
  className = '',
  variant = 'loading',
  lineCount = 1,
  data,
}) => {
  // ダミーデータの生成（スケルトン表示用）
  const emptyData = Array.from({ length: 10 }, (_, i) => ({
    year: 1980 + i * 5,
    ...Array.from({ length: lineCount }, (_, j) => ({
      [`value${j + 1}`]: 0,
    })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
  }));

  // グレースケールの色を生成
  const getLineColor = (index: number) => {
    const baseColor = 209; // Tailwind gray-300
    const step = 15;
    return `rgb(${baseColor - step * index}, ${baseColor - step * index}, ${baseColor - step * index})`;
  };

  // 実際のデータまたはダミーデータを使用
  const chartData = data || emptyData;

  return (
    <div className={`w-full h-[400px] p-4 bg-white rounded-lg shadow-sm ${className}`}>
      {variant === 'loading' ? (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="inline-block p-3 bg-gray-50 rounded-full">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
          <p className="mt-4 text-gray-600">データを読み込んでいます...</p>
        </div>
      ) : (
        <>
          <div className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  className={!data ? "animate-pulse" : ""}
                />
                <XAxis
                  dataKey="year"
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                  tickLine={{ stroke: '#9CA3AF' }}
                  axisLine={{ stroke: '#9CA3AF' }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  tick={data ? { fill: '#9CA3AF' } : false}
                  tickLine={data ? { stroke: '#9CA3AF' } : false}
                  axisLine={{ stroke: '#9CA3AF' }}
                />
                <Tooltip
                  contentStyle={data ? undefined : { display: 'none' }}
                  cursor={{ stroke: '#9CA3AF', strokeWidth: 1 }}
                />
                <Legend
                  wrapperStyle={{ opacity: data ? 1 : 0.5 }}
                  formatter={data ? undefined : () => (
                    <span className="inline-block w-16 h-4 bg-gray-200 rounded animate-pulse" />
                  )}
                />
                {Array.from({ length: lineCount }, (_, i) => (
                  <Line
                    key={`line-${i}`}
                    type="monotone"
                    dataKey={data ? `value${i + 1}` : `value${i + 1}`}
                    stroke={data ? `hsl(${i * 60}, 70%, 50%)` : getLineColor(i)}
                    strokeDasharray={data ? undefined : "5 5"}
                    strokeWidth={2}
                    dot={data ? { r: 4 } : false}
                    activeDot={data ? { r: 6 } : false}
                    animationDuration={data ? 1000 : 0}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}; 