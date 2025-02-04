'use client';

import { FC, useMemo } from 'react';
import { LineGraph, DataPoint } from '@/components/ui/LineGraph';
import { PrefecturePopulation } from '@/types/api/population';
import { Prefecture } from '@/types/api/prefecture';
import { CHART_COLORS } from '@/constants/chart';
import { PopulationType } from '../population/PopulationTypeSelector';

export interface PopulationChartProps {
  prefectures: Prefecture[];
  populationData: {
    prefCode: number;
    data: PrefecturePopulation;
  }[];
  selectedType: PopulationType;
  className?: string;
}

export const PopulationChart: FC<PopulationChartProps> = ({
  prefectures,
  populationData,
  selectedType,
  className = '',
}) => {
  const chartData = useMemo(() => {
    // 全ての年のユニークなリストを作成
    const years = new Set<number>();
    populationData.forEach(({ data }) => {
      const populationTypeData = data.data.find(d => d.label === selectedType);
      if (populationTypeData) {
        populationTypeData.data.forEach(({ year }) => years.add(year));
      }
    });

    // 年ごとのデータを作成
    return Array.from(years).sort().map(year => {
      const yearData: { [key: string]: number } & { year: number; value: number } = {
        year,
        value: 0
      };
      
      populationData.forEach(({ prefCode, data }) => {
        const populationTypeData = data.data.find(d => d.label === selectedType);
        const yearPopulation = populationTypeData?.data.find(d => d.year === year);
        yearData[`value${prefCode}`] = yearPopulation?.value ?? 0;
      });

      return yearData as DataPoint;
    });
  }, [populationData, selectedType]);

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
        yAxisLabel={`${selectedType}（人）`}
        tooltipFormatter={(value) => `${value.toLocaleString()}人`}
      />
    </div>
  );
}; 