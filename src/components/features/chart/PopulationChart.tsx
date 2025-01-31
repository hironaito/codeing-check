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
    // 全ての年のユニークなリストを作成
    const years = new Set<number>();
    populationData.forEach(({ data }) => {
      data.data[0].data.forEach(({ year }) => years.add(year));
    });

    // 年ごとのデータを作成
    return Array.from(years).sort().map(year => {
      const yearData: { [key: string]: number } & { year: number; value: number } = {
        year,
        value: 0
      };
      
      populationData.forEach(({ prefCode, data }) => {
        const totalPopulation = data.data[0].data.find(d => d.year === year);
        yearData[`value${prefCode}`] = totalPopulation?.value ?? 0;
      });

      return yearData as DataPoint;
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