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

interface ChartSkeletonProps {
  className?: string;
  variant?: 'loading' | 'empty';
  lineCount?: number;
}

export const ChartSkeleton: FC<ChartSkeletonProps> = ({
  className = '',
  variant = 'loading',
  lineCount = 1,
}) => {
  // ダミーデータの生成（スケルトン表示用）
  const data = variant === 'loading'
    ? Array.from({ length: 10 }, (_, i) => ({
        year: 1980 + i * 5,
        ...Array.from({ length: lineCount }, (_, j) => ({
          [`value${j + 1}`]: Math.random() * 60 + 20,
        })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
      }))
    : Array.from({ length: 10 }, (_, i) => ({
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

  return (
    <div className={`w-full h-[400px] p-4 bg-white rounded-lg shadow-sm ${className}`}>
      {/* グラフのタイトル部分 */}
      <div className="mb-4 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded" />
      </div>

      <div className="h-[calc(100%-2rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              className="animate-pulse"
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
              tick={variant === 'loading' ? { fill: '#9CA3AF' } : false}
              tickLine={variant === 'loading' ? { stroke: '#9CA3AF' } : false}
              axisLine={{ stroke: '#9CA3AF' }}
            />
            <Tooltip
              contentStyle={{ display: 'none' }}
              cursor={{ stroke: '#9CA3AF', strokeWidth: 1 }}
            />
            <Legend
              wrapperStyle={{ opacity: 0.5 }}
              formatter={() => (
                <span className="inline-block w-16 h-4 bg-gray-200 rounded animate-pulse" />
              )}
            />
            {Array.from({ length: lineCount }, (_, i) => (
              variant === 'loading' ? (
                <Line
                  key={`line-${i}`}
                  type="monotone"
                  dataKey={`value${i + 1}`}
                  stroke={getLineColor(i)}
                  strokeWidth={2}
                  dot={{ fill: getLineColor(i), r: 4 }}
                  activeDot={false}
                  animationDuration={0}
                />
              ) : (
                <Line
                  key={`line-${i}`}
                  type="monotone"
                  dataKey={`value${i + 1}`}
                  stroke={getLineColor(i)}
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                  animationDuration={0}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 