import {
  groupPopulationByYear,
  getPopulationByYear,
  getYearRange,
  getPopulationRange,
  calculatePopulationGrowthRate,
  calculatePopulationRatio,
  getFuturePopulation,
  getPopulationPeak,
  calculateDemographicChange,
} from '../population';
import { PopulationData } from '@/types/api/population';

describe('Population Utilities', () => {
  const sampleData: PopulationData[] = [
    { year: 2015, value: 1000 },
    { year: 2020, value: 1200 },
    { year: 2025, value: 1100 },
  ];

  describe('groupPopulationByYear', () => {
    it('年ごとの人口データを正しくグループ化する', () => {
      const result = groupPopulationByYear(sampleData);
      expect(result).toEqual({
        2015: 1000,
        2020: 1200,
        2025: 1100,
      });
    });
  });

  describe('getPopulationByYear', () => {
    it('指定された年の人口データを取得する', () => {
      const result = getPopulationByYear(sampleData, 2020);
      expect(result).toBe(1200);
    });

    it('存在しない年の場合はnullを返す', () => {
      const result = getPopulationByYear(sampleData, 2000);
      expect(result).toBeNull();
    });
  });

  describe('getYearRange', () => {
    it('データの年範囲を正しく取得する', () => {
      const result = getYearRange(sampleData);
      expect(result).toEqual({ start: 2015, end: 2025 });
    });

    it('空のデータの場合はnullを返す', () => {
      const result = getYearRange([]);
      expect(result).toBeNull();
    });
  });

  describe('getPopulationRange', () => {
    it('人口の最大値と最小値を正しく取得する', () => {
      const result = getPopulationRange(sampleData);
      expect(result).toEqual({ min: 1000, max: 1200 });
    });

    it('空のデータの場合はnullを返す', () => {
      const result = getPopulationRange([]);
      expect(result).toBeNull();
    });
  });

  describe('calculatePopulationGrowthRate', () => {
    it('人口増減率を正しく計算する', () => {
      const result = calculatePopulationGrowthRate(sampleData, 2015, 2020);
      expect(result).toBe(20); // (1200 - 1000) / 1000 * 100
    });

    it('存在しない年の場合はnullを返す', () => {
      const result = calculatePopulationGrowthRate(sampleData, 2000, 2020);
      expect(result).toBeNull();
    });
  });

  describe('calculatePopulationRatio', () => {
    const totalPopulation: PopulationData[] = [
      { year: 2020, value: 1000 },
    ];
    const targetPopulation: PopulationData[] = [
      { year: 2020, value: 200 },
    ];

    it('人口構成比を正しく計算する', () => {
      const result = calculatePopulationRatio(totalPopulation, targetPopulation);
      expect(result).toEqual([
        { year: 2020, value: 20 }, // (200 / 1000) * 100
      ]);
    });
  });

  describe('getFuturePopulation', () => {
    it('指定された年以降の人口データを取得する', () => {
      const result = getFuturePopulation(sampleData, 2020);
      expect(result).toEqual([
        { year: 2020, value: 1200 },
        { year: 2025, value: 1100 },
      ]);
    });
  });

  describe('getPopulationPeak', () => {
    it('人口のピーク時のデータを取得する', () => {
      const result = getPopulationPeak(sampleData);
      expect(result).toEqual({ year: 2020, value: 1200 });
    });

    it('空のデータの場合はnullを返す', () => {
      const result = getPopulationPeak([]);
      expect(result).toBeNull();
    });
  });

  describe('calculateDemographicChange', () => {
    const youngData = [{ year: 2020, value: 200 }];
    const workingData = [{ year: 2020, value: 600 }];
    const elderlyData = [{ year: 2020, value: 200 }];

    it('年代別人口構成比を正しく計算する', () => {
      const result = calculateDemographicChange(youngData, workingData, elderlyData, 2020);
      expect(result).toEqual({
        young: 20,    // (200 / 1000) * 100
        working: 60,  // (600 / 1000) * 100
        elderly: 20,  // (200 / 1000) * 100
      });
    });

    it('存在しない年の場合はnullを返す', () => {
      const result = calculateDemographicChange(youngData, workingData, elderlyData, 2000);
      expect(result).toBeNull();
    });
  });
}); 