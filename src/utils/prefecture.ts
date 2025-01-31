import { Prefecture } from '@/types/api/prefecture';

/**
 * 都道府県を地域ごとにグループ化
 */
export const groupPrefecturesByRegion = (prefectures: Prefecture[]): Record<string, Prefecture[]> => {
  const regions: Record<string, Prefecture[]> = {
    '北海道': [],
    '東北': [],
    '関東': [],
    '中部': [],
    '近畿': [],
    '中国': [],
    '四国': [],
    '九州': [],
  };

  prefectures.forEach(prefecture => {
    if (prefecture.prefCode === 1) {
      regions['北海道'].push(prefecture);
    } else if (prefecture.prefCode >= 2 && prefecture.prefCode <= 7) {
      regions['東北'].push(prefecture);
    } else if (prefecture.prefCode >= 8 && prefecture.prefCode <= 14) {
      regions['関東'].push(prefecture);
    } else if (prefecture.prefCode >= 15 && prefecture.prefCode <= 23) {
      regions['中部'].push(prefecture);
    } else if (prefecture.prefCode >= 24 && prefecture.prefCode <= 30) {
      regions['近畿'].push(prefecture);
    } else if (prefecture.prefCode >= 31 && prefecture.prefCode <= 35) {
      regions['中国'].push(prefecture);
    } else if (prefecture.prefCode >= 36 && prefecture.prefCode <= 39) {
      regions['四国'].push(prefecture);
    } else if (prefecture.prefCode >= 40 && prefecture.prefCode <= 47) {
      regions['九州'].push(prefecture);
    }
  });

  return regions;
};

/**
 * 都道府県名から都道府県コードを取得
 */
export const getPrefCodeByName = (prefectures: Prefecture[], prefName: string): number | null => {
  const prefecture = prefectures.find(pref => pref.prefName === prefName);
  return prefecture ? prefecture.prefCode : null;
};

/**
 * 都道府県コードから都道府県名を取得
 */
export const getPrefNameByCode = (prefectures: Prefecture[], prefCode: number): string | null => {
  const prefecture = prefectures.find(pref => pref.prefCode === prefCode);
  return prefecture ? prefecture.prefName : null;
};

// 五十音順のマッピング
const kanaMap: Record<string, string> = {
  '北海道': 'ほっかいどう',
  '青森県': 'あおもりけん',
  '岩手県': 'いわてけん',
  '宮城県': 'みやぎけん',
  '秋田県': 'あきたけん',
  '山形県': 'やまがたけん',
  '福島県': 'ふくしまけん',
  '茨城県': 'いばらきけん',
  '栃木県': 'とちぎけん',
  '群馬県': 'ぐんまけん',
  '埼玉県': 'さいたまけん',
  '千葉県': 'ちばけん',
  '東京都': 'とうきょうと',
  '神奈川県': 'かながわけん',
  '新潟県': 'にいがたけん',
  '富山県': 'とやまけん',
  '石川県': 'いしかわけん',
  '福井県': 'ふくいけん',
  '山梨県': 'やまなしけん',
  '長野県': 'ながのけん',
  '岐阜県': 'ぎふけん',
  '静岡県': 'しずおかけん',
  '愛知県': 'あいちけん',
  '三重県': 'みえけん',
  '滋賀県': 'しがけん',
  '京都府': 'きょうとふ',
  '大阪府': 'おおさかふ',
  '兵庫県': 'ひょうごけん',
  '奈良県': 'ならけん',
  '和歌山県': 'わかやまけん',
  '鳥取県': 'とっとりけん',
  '島根県': 'しまねけん',
  '岡山県': 'おかやまけん',
  '広島県': 'ひろしまけん',
  '山口県': 'やまぐちけん',
  '徳島県': 'とくしまけん',
  '香川県': 'かがわけん',
  '愛媛県': 'えひめけん',
  '高知県': 'こうちけん',
  '福岡県': 'ふくおかけん',
  '佐賀県': 'さがけん',
  '長崎県': 'ながさきけん',
  '熊本県': 'くまもとけん',
  '大分県': 'おおいたけん',
  '宮崎県': 'みやざきけん',
  '鹿児島県': 'かごしまけん',
  '沖縄県': 'おきなわけん',
};

/**
 * 都道府県を五十音順にソート
 */
export const sortPrefecturesByKana = (prefectures: Prefecture[]): Prefecture[] => {
  return [...prefectures].sort((a, b) => {
    const kanaA = kanaMap[a.prefName] || a.prefName;
    const kanaB = kanaMap[b.prefName] || b.prefName;
    return kanaA.localeCompare(kanaB, 'ja');
  });
};

/**
 * 指定された地域の都道府県を取得
 */
export const getPrefecturesByRegion = (prefectures: Prefecture[], region: string): Prefecture[] => {
  const groupedPrefectures = groupPrefecturesByRegion(prefectures);
  return groupedPrefectures[region] || [];
};

/**
 * 都道府県の存在チェック
 */
export const isPrefectureExists = (prefectures: Prefecture[], prefCode: number): boolean => {
  return prefectures.some(pref => pref.prefCode === prefCode);
};

/**
 * 都道府県の検索（部分一致）
 */
export const searchPrefectures = (prefectures: Prefecture[], query: string): Prefecture[] => {
  const normalizedQuery = query.toLowerCase();
  return prefectures.filter(pref => {
    const prefKana = kanaMap[pref.prefName] || '';
    return pref.prefName.toLowerCase().includes(normalizedQuery) ||
           prefKana.includes(normalizedQuery);
  });
};

/**
 * 複数の都道府県コードの配列を都道府県オブジェクトの配列に変換
 */
export const convertPrefCodesToObjects = (
  prefectures: Prefecture[],
  prefCodes: number[]
): Prefecture[] => {
  return prefCodes
    .map(code => prefectures.find(pref => pref.prefCode === code))
    .filter((pref): pref is Prefecture => pref !== undefined);
}; 