import { PopulationComposition, PopulationData } from '@/types/api/population';
import { Prefecture } from '@/types/api/prefecture';

/**
 * 人口データを年代ごとにグループ化
 */
export const groupPopulationByYear = (data: PopulationData[]): Record<number, number> => {
  return data.reduce((acc, curr) => {
    acc[curr.year] = curr.value;
    return acc;
  }, {} as Record<number, number>);
};

/**
 * 指定された年の人口データを取得
 */
export const getPopulationByYear = (data: PopulationData[], year: number): number | null => {
  const found = data.find(d => d.year === year);
  return found ? found.value : null;
};

/**
 * 人口データの年代範囲を取得
 */
export const getYearRange = (data: PopulationData[]): { start: number; end: number } | null => {
  if (data.length === 0) return null;
  
  const years = data.map(d => d.year);
  return {
    start: Math.min(...years),
    end: Math.max(...years),
  };
};

/**
 * 人口データの最大値と最小値を取得
 */
export const getPopulationRange = (data: PopulationData[]): { min: number; max: number } | null => {
  if (data.length === 0) return null;

  const values = data.map(d => d.value);
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
};

/**
 * 人口増減率を計算
 */
export const calculatePopulationGrowthRate = (
  data: PopulationData[],
  baseYear: number,
  targetYear: number
): number | null => {
  const baseValue = data.find(d => d.year === baseYear)?.value;
  const targetValue = data.find(d => d.year === targetYear)?.value;

  if (!baseValue || !targetValue) return null;

  return ((targetValue - baseValue) / baseValue) * 100;
};

/**
 * 年齢区分ごとの人口構成比を計算
 */
export const calculatePopulationRatio = (
  totalPopulation: PopulationData[],
  targetPopulation: PopulationData[]
): PopulationData[] => {
  return totalPopulation.map(total => {
    const target = targetPopulation.find(t => t.year === total.year);
    if (!target || total.value === 0) return { year: total.year, value: 0 };
    
    return {
      year: total.year,
      value: (target.value / total.value) * 100,
    };
  });
};

/**
 * 複数の都道府県の人口データを比較可能な形式に整形
 */
export const formatPopulationComparisonData = (
  prefectures: Prefecture[],
  populationData: Record<number, PopulationComposition[]>
) => {
  const years = new Set<number>();
  const formattedData: {
    prefecture: string;
    data: { year: number; value: number }[];
  }[] = [];

  // 全ての年を収集
  Object.values(populationData).forEach(compositions => {
    compositions.forEach(composition => {
      composition.data.forEach(d => years.add(d.year));
    });
  });

  // 都道府県ごとにデータを整形
  Object.entries(populationData).forEach(([prefCode, compositions]) => {
    const prefecture = prefectures.find(p => p.prefCode === Number(prefCode));
    if (!prefecture) return;

    const totalPopulation = compositions.find(c => c.label === '総人口');
    if (!totalPopulation) return;

    formattedData.push({
      prefecture: prefecture.prefName,
      data: Array.from(years).map(year => ({
        year,
        value: getPopulationByYear(totalPopulation.data, year) ?? 0,
      })).sort((a, b) => a.year - b.year),
    });
  });

  return formattedData;
};

/**
 * 将来推計人口の取得
 */
export const getFuturePopulation = (data: PopulationData[], fromYear: number): PopulationData[] => {
  return data.filter(d => d.year >= fromYear);
};

/**
 * 人口ピーク時の年と人口を取得
 */
export const getPopulationPeak = (data: PopulationData[]): { year: number; value: number } | null => {
  if (data.length === 0) return null;

  return data.reduce((peak, current) => {
    return current.value > peak.value ? current : peak;
  });
};

/**
 * 年代別の人口構成比の変化を計算
 */
export const calculateDemographicChange = (
  youngPopulation: PopulationData[],
  workingPopulation: PopulationData[],
  elderlyPopulation: PopulationData[],
  targetYear: number
): { young: number; working: number; elderly: number } | null => {
  const young = youngPopulation.find(d => d.year === targetYear)?.value;
  const working = workingPopulation.find(d => d.year === targetYear)?.value;
  const elderly = elderlyPopulation.find(d => d.year === targetYear)?.value;

  if (!young || !working || !elderly) return null;

  const total = young + working + elderly;
  return {
    young: (young / total) * 100,
    working: (working / total) * 100,
    elderly: (elderly / total) * 100,
  };
}; 