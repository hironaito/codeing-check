import {
  groupPopulationByYear,
  getPopulationByYear,
  getYearRange,
  getPopulationRange,
  calculatePopulationGrowthRate,
  calculatePopulationRatio,
  formatPopulationComparisonData,
  getFuturePopulation,
  getPopulationPeak,
  calculateDemographicChange,
} from '../population';
import { PopulationData, PopulationComposition } from '@/types/api/population';
import { Prefecture } from '@/types/api/prefecture';

describe('Population Utilities', () => {
  // テスト用のモックデータ
  const mockPopulationData: PopulationData[] = [
    { year: 2015, value: 1000000 },
    { year: 2020, value: 950000 },
    { year: 2025, value: 900000 },
    { year: 2030, value: 850000 },
  ];

  describe('groupPopulationByYear', () => {
    it('人口データを年代ごとに正しくグループ化すること', () => {
      const result = groupPopulationByYear(mockPopulationData);
      expect(result).toEqual({
        2015: 1000000,
        2020: 950000,
        2025: 900000,
        2030: 850000,
      });
    });

    it('空の配列の場合は空のオブジェクトを返すこと', () => {
      const result = groupPopulationByYear([]);
      expect(result).toEqual({});
    });
  });

  describe('getPopulationByYear', () => {
    it('指定された年の人口データを正しく取得すること', () => {
      const result = getPopulationByYear(mockPopulationData, 2020);
      expect(result).toBe(950000);
    });

    it('存在しない年の場合はnullを返すこと', () => {
      const result = getPopulationByYear(mockPopulationData, 2000);
      expect(result).toBeNull();
    });
  });

  describe('getYearRange', () => {
    it('人口データの年代範囲を正しく取得すること', () => {
      const result = getYearRange(mockPopulationData);
      expect(result).toEqual({
        start: 2015,
        end: 2030,
      });
    });

    it('空の配列の場合はnullを返すこと', () => {
      const result = getYearRange([]);
      expect(result).toBeNull();
    });
  });

  describe('getPopulationRange', () => {
    it('人口データの最大値と最小値を正しく取得すること', () => {
      const result = getPopulationRange(mockPopulationData);
      expect(result).toEqual({
        min: 850000,
        max: 1000000,
      });
    });

    it('空の配列の場合はnullを返すこと', () => {
      const result = getPopulationRange([]);
      expect(result).toBeNull();
    });
  });

  describe('calculatePopulationGrowthRate', () => {
    it('人口増減率を正しく計算すること', () => {
      const result = calculatePopulationGrowthRate(mockPopulationData, 2015, 2020);
      expect(result).toBe(-5); // (950000 - 1000000) / 1000000 * 100 = -5%
    });

    it('存在しない年の場合はnullを返すこと', () => {
      const result = calculatePopulationGrowthRate(mockPopulationData, 2000, 2020);
      expect(result).toBeNull();
    });
  });

  describe('calculatePopulationRatio', () => {
    const totalPopulation: PopulationData[] = [
      { year: 2020, value: 1000000 },
      { year: 2025, value: 900000 },
    ];
    const youngPopulation: PopulationData[] = [
      { year: 2020, value: 200000 },
      { year: 2025, value: 150000 },
    ];

    it('年齢区分ごとの人口構成比を正しく計算すること', () => {
      const result = calculatePopulationRatio(totalPopulation, youngPopulation);
      // 浮動小数点数の比較は近似値で行う
      expect(result).toEqual([
        { year: 2020, value: 20 },
        { year: 2025, value: expect.closeTo(16.67, 2) },
      ]);
    });

    it('総人口が0の場合は0を返すこと', () => {
      const result = calculatePopulationRatio(
        [{ year: 2020, value: 0 }],
        [{ year: 2020, value: 100 }]
      );
      expect(result).toEqual([{ year: 2020, value: 0 }]);
    });
  });

  describe('formatPopulationComparisonData', () => {
    const mockPrefectures: Prefecture[] = [
      { prefCode: 1, prefName: '北海道' },
      { prefCode: 2, prefName: '青森県' },
    ];
    const mockCompositionData: Record<number, PopulationComposition[]> = {
      1: [{
        label: '総人口',
        data: [
          { year: 2020, value: 1000000 },
          { year: 2025, value: 950000 },
        ],
      }],
      2: [{
        label: '総人口',
        data: [
          { year: 2020, value: 500000 },
          { year: 2025, value: 450000 },
        ],
      }],
    };

    it('複数の都道府県の人口データを正しく整形すること', () => {
      const result = formatPopulationComparisonData(mockPrefectures, mockCompositionData);
      expect(result).toEqual([
        {
          prefecture: '北海道',
          data: [
            { year: 2020, value: 1000000 },
            { year: 2025, value: 950000 },
          ],
        },
        {
          prefecture: '青森県',
          data: [
            { year: 2020, value: 500000 },
            { year: 2025, value: 450000 },
          ],
        },
      ]);
    });

    it('存在しない都道府県のデータは除外されること', () => {
      const result = formatPopulationComparisonData(
        [{ prefCode: 1, prefName: '北海道' }],
        mockCompositionData
      );
      expect(result).toHaveLength(1);
      expect(result[0].prefecture).toBe('北海道');
    });
  });

  describe('getFuturePopulation', () => {
    it('指定された年以降の人口データを取得すること', () => {
      const result = getFuturePopulation(mockPopulationData, 2025);
      expect(result).toEqual([
        { year: 2025, value: 900000 },
        { year: 2030, value: 850000 },
      ]);
    });

    it('指定された年以降のデータが存在しない場合は空配列を返すこと', () => {
      const result = getFuturePopulation(mockPopulationData, 2035);
      expect(result).toEqual([]);
    });
  });

  describe('getPopulationPeak', () => {
    it('人口のピーク時の年と人口を正しく取得すること', () => {
      const result = getPopulationPeak(mockPopulationData);
      expect(result).toEqual({ year: 2015, value: 1000000 });
    });

    it('空の配列の場合はnullを返すこと', () => {
      const result = getPopulationPeak([]);
      expect(result).toBeNull();
    });
  });

  describe('calculateDemographicChange', () => {
    const mockYoungPop = [{ year: 2020, value: 200000 }];
    const mockWorkingPop = [{ year: 2020, value: 600000 }];
    const mockElderlyPop = [{ year: 2020, value: 200000 }];

    it('年代別の人口構成比の変化を正しく計算すること', () => {
      const result = calculateDemographicChange(
        mockYoungPop,
        mockWorkingPop,
        mockElderlyPop,
        2020
      );
      expect(result).toEqual({
        young: 20,    // (200000 / 1000000) * 100 = 20%
        working: 60,  // (600000 / 1000000) * 100 = 60%
        elderly: 20,  // (200000 / 1000000) * 100 = 20%
      });
    });

    it('指定された年のデータが存在しない場合はnullを返すこと', () => {
      const result = calculateDemographicChange(
        mockYoungPop,
        mockWorkingPop,
        mockElderlyPop,
        2025
      );
      expect(result).toBeNull();
    });
  });
}); 