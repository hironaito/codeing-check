'use client';

import { FC, useMemo } from 'react';
import { LineGraph, DataPoint } from '@/components/ui/LineGraph';
import { PrefecturePopulation } from '@/types/api/population';
import { Prefecture } from '@/types/api/prefecture';
import { CHART_COLORS } from '@/constants/chart';

export interface PopulationChartProps {
  prefectures: Prefecture[];
  populationData: {
    prefCode: number;
    data: PrefecturePopulation;
  }[];
  className?: string;
}

export const PopulationChart: FC<PopulationChartProps> = ({
  prefectures,
  populationData,
  className = '',
}) => {
  const chartData = useMemo(() => {
    // 総人口データのみを使用
    const totalPopulationData = populationData.map(p => ({
      prefCode: p.prefCode,
      data: p.data.data.find(d => d.label === '総人口')?.data ?? []
    }));

    // 年度のユニークな配列を作成
    const years = Array.from(
      new Set(
        totalPopulationData.flatMap(p => p.data.map(d => d.year))
      )
    ).sort((a, b) => a - b);

    // 各年度ごとのデータを作成
    return years.map((year) => {
      const baseData: DataPoint = {
        year,
        value: 0,
      };

      const yearData = totalPopulationData.reduce((acc, p) => {
        const value = p.data.find((d) => d.year === year)?.value ?? 0;
        return {
          ...acc,
          [`value${p.prefCode}`]: value,
        };
      }, baseData);

      return yearData;
    });
  }, [populationData]);

  const lines = useMemo(() => {
    return populationData.map((p, index) => {
      const prefecture = prefectures.find((pref) => pref.prefCode === p.prefCode);
      return {
        dataKey: `value${p.prefCode}`,
        name: prefecture?.prefName ?? `都道府県${p.prefCode}`,
        color: Object.values(CHART_COLORS)[index % Object.keys(CHART_COLORS).length],
      };
    });
  }, [populationData, prefectures]);

  if (!chartData.length || !lines.length) {
    return null;
  }

  return (
    <div className={className}>
      <LineGraph
        data={chartData}
        lines={lines}
        xAxisLabel="年度"
        yAxisLabel="人口数"
        tooltipFormatter={(value) => `${value.toLocaleString()}人`}
      />
    </div>
  );
}; 