# データ加工ユーティリティ

## 人口データユーティリティ (`src/utils/population.ts`)

### 基本的なデータ取得

```typescript
// 年代ごとのグループ化
const yearlyData = groupPopulationByYear(populationData);
// => { 2015: 1000, 2020: 1200, ... }

// 特定年の人口データ取得
const population2020 = getPopulationByYear(populationData, 2020);
// => 1200 or null

// 年代範囲の取得
const yearRange = getYearRange(populationData);
// => { start: 2015, end: 2025 }

// 人口の最大値・最小値
const populationRange = getPopulationRange(populationData);
// => { min: 1000, max: 1200 }
```

### 統計・分析機能

```typescript
// 人口増減率の計算
const growthRate = calculatePopulationGrowthRate(
  populationData,
  2015,  // 基準年
  2020   // 対象年
);
// => 20 (20%の増加)

// 年齢区分ごとの人口構成比
const ratio = calculatePopulationRatio(totalPopulation, youngPopulation);
// => [{ year: 2020, value: 20 }, ...] (20%など)

// 将来推計人口の取得
const futureData = getFuturePopulation(populationData, 2020);
// => 2020年以降のデータ

// 人口ピーク時のデータ
const peakData = getPopulationPeak(populationData);
// => { year: 2020, value: 1200 }

// 年代別人口構成比の変化
const demographicChange = calculateDemographicChange(
  youngPopulation,
  workingPopulation,
  elderlyPopulation,
  2020
);
// => { young: 20, working: 60, elderly: 20 }
```

### データ整形

```typescript
// 複数都道府県の比較データ作成
const comparisonData = formatPopulationComparisonData(
  prefectures,
  populationData
);
// => [{ prefecture: '東京都', data: [...] }, ...]
```

## 都道府県ユーティリティ (`src/utils/prefecture.ts`)

### 地域関連

```typescript
// 地域ごとのグループ化
const regionGroups = groupPrefecturesByRegion(prefectures);
// => { '北海道': [...], '東北': [...], ... }

// 特定地域の都道府県取得
const kantoPrefectures = getPrefecturesByRegion(prefectures, '関東');
// => [{ prefCode: 13, prefName: '東京都' }, ...]
```

### コード・名称変換

```typescript
// 都道府県名からコードを取得
const code = getPrefCodeByName(prefectures, '東京都');
// => 13

// コードから都道府県名を取得
const name = getPrefNameByCode(prefectures, 13);
// => '東京都'

// コード配列をオブジェクト配列に変換
const prefObjects = convertPrefCodesToObjects(prefectures, [1, 13]);
// => [{ prefCode: 1, prefName: '北海道' }, ...]
```

### 検索・ソート

```typescript
// 五十音順ソート
const sortedPrefs = sortPrefecturesByKana(prefectures);

// 都道府県の存在チェック
const exists = isPrefectureExists(prefectures, 13);
// => true

// 都道府県の検索（部分一致）
const searchResults = searchPrefectures(prefectures, '東京');
// => [{ prefCode: 13, prefName: '東京都' }]
```

## 使用例

### 地域別人口推移の分析
```typescript
// 関東地方の都道府県を取得
const kantoPrefs = getPrefecturesByRegion(allPrefectures, '関東');

// 各都道府県の人口データを取得・整形
const populationTrends = formatPopulationComparisonData(
  kantoPrefs,
  populationData
);

// 2020年時点での人口構成比を計算
const demographicData = kantoPrefs.map(pref => ({
  prefecture: pref.prefName,
  demographics: calculateDemographicChange(
    youngPopulations[pref.prefCode],
    workingPopulations[pref.prefCode],
    elderlyPopulations[pref.prefCode],
    2020
  )
}));
```

### 将来推計に基づく分析
```typescript
// 2020年以降の将来推計データを取得
const futureData = getFuturePopulation(populationData, 2020);

// 人口のピーク時を特定
const peakInfo = getPopulationPeak(futureData);

// 人口増減率を計算
const growthRate = calculatePopulationGrowthRate(
  futureData,
  2020,
  2045
);
``` 