import {
  groupPrefecturesByRegion,
  getPrefCodeByName,
  getPrefNameByCode,
  sortPrefecturesByKana,
  getPrefecturesByRegion,
  isPrefectureExists,
  searchPrefectures,
  convertPrefCodesToObjects,
} from '../prefecture';
import { Prefecture } from '@/types/api/prefecture';

describe('Prefecture Utilities', () => {
  const samplePrefectures: Prefecture[] = [
    { prefCode: 1, prefName: '北海道' },
    { prefCode: 13, prefName: '東京都' },
    { prefCode: 27, prefName: '大阪府' },
    { prefCode: 47, prefName: '沖縄県' },
  ];

  describe('groupPrefecturesByRegion', () => {
    it('都道府県を正しく地域ごとにグループ化する', () => {
      const result = groupPrefecturesByRegion(samplePrefectures);
      expect(result['北海道']).toHaveLength(1);
      expect(result['関東']).toHaveLength(1);
      expect(result['近畿']).toHaveLength(1);
      expect(result['九州']).toHaveLength(1);
    });

    it('全ての地域キーが存在する', () => {
      const result = groupPrefecturesByRegion(samplePrefectures);
      const expectedRegions = ['北海道', '東北', '関東', '中部', '近畿', '中国', '四国', '九州'];
      expectedRegions.forEach(region => {
        expect(result).toHaveProperty(region);
      });
    });
  });

  describe('getPrefCodeByName', () => {
    it('都道府県名から正しく都道府県コードを取得する', () => {
      const result = getPrefCodeByName(samplePrefectures, '東京都');
      expect(result).toBe(13);
    });

    it('存在しない都道府県名の場合はnullを返す', () => {
      const result = getPrefCodeByName(samplePrefectures, '存在しない県');
      expect(result).toBeNull();
    });
  });

  describe('getPrefNameByCode', () => {
    it('都道府県コードから正しく都道府県名を取得する', () => {
      const result = getPrefNameByCode(samplePrefectures, 13);
      expect(result).toBe('東京都');
    });

    it('存在しない都道府県コードの場合はnullを返す', () => {
      const result = getPrefNameByCode(samplePrefectures, 99);
      expect(result).toBeNull();
    });
  });

  describe('sortPrefecturesByKana', () => {
    it('都道府県を五十音順に正しくソートする', () => {
      const result = sortPrefecturesByKana(samplePrefectures);
      expect(result.map(p => p.prefName)).toEqual([
        '大阪府',
        '沖縄県',
        '東京都',
        '北海道',
      ]);
    });
  });

  describe('getPrefecturesByRegion', () => {
    it('指定された地域の都道府県を正しく取得する', () => {
      const result = getPrefecturesByRegion(samplePrefectures, '関東');
      expect(result).toHaveLength(1);
      expect(result[0].prefName).toBe('東京都');
    });

    it('存在しない地域の場合は空配列を返す', () => {
      const result = getPrefecturesByRegion(samplePrefectures, '存在しない地域');
      expect(result).toEqual([]);
    });
  });

  describe('isPrefectureExists', () => {
    it('存在する都道府県コードの場合はtrueを返す', () => {
      const result = isPrefectureExists(samplePrefectures, 13);
      expect(result).toBe(true);
    });

    it('存在しない都道府県コードの場合はfalseを返す', () => {
      const result = isPrefectureExists(samplePrefectures, 99);
      expect(result).toBe(false);
    });
  });

  describe('searchPrefectures', () => {
    it('都道府県名で正しく検索できる', () => {
      const result = searchPrefectures(samplePrefectures, '東京');
      expect(result).toHaveLength(1);
      expect(result[0].prefName).toBe('東京都');
    });

    it('該当する都道府県がない場合は空配列を返す', () => {
      const result = searchPrefectures(samplePrefectures, '存在しない県');
      expect(result).toEqual([]);
    });

    it('大文字小文字を区別せずに検索できる', () => {
      const result = searchPrefectures(samplePrefectures, 'とうきょう');
      expect(result).toHaveLength(1);
      expect(result[0].prefName).toBe('東京都');
    });
  });

  describe('convertPrefCodesToObjects', () => {
    it('都道府県コードの配列を都道府県オブジェクトの配列に変換する', () => {
      const prefCodes = [1, 13];
      const result = convertPrefCodesToObjects(samplePrefectures, prefCodes);
      expect(result).toHaveLength(2);
      expect(result.map(p => p.prefName)).toEqual(['北海道', '東京都']);
    });

    it('存在しない都道府県コードは除外される', () => {
      const prefCodes = [1, 99];
      const result = convertPrefCodesToObjects(samplePrefectures, prefCodes);
      expect(result).toHaveLength(1);
      expect(result[0].prefName).toBe('北海道');
    });
  });
}); 