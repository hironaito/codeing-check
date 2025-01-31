# テスト計画書

## テスト戦略

本プロジェクトでは、以下のテストレベルを設定し、品質を担保します。

### 1. ユニットテスト

- **対象**: 個別のコンポーネント、関数、カスタムフック
- **ツール**: Jest + React Testing Library
- **カバレッジ目標**: 80%以上

#### テスト項目

1. UIコンポーネント
   - レンダリング
   - イベントハンドリング
   - プロップス検証
   - エラー状態

2. ユーティリティ関数
   - 入力値の検証
   - エッジケース
   - エラーハンドリング

3. カスタムフック
   - 状態管理
   - 副作用
   - クリーンアップ

### 2. 統合テスト

- **対象**: コンポーネント間の連携、APIとの統合
- **ツール**: Jest + React Testing Library + MSW
- **カバレッジ目標**: 70%以上

#### テスト項目

1. データフロー
   - API通信
   - 状態更新
   - エラーハンドリング

2. コンポーネント連携
   - イベント伝播
   - データ受け渡し
   - 状態共有

### 3. E2Eテスト

- **対象**: ユーザーシナリオ
- **ツール**: Playwright
- **カバレッジ目標**: 主要フロー100%

#### テストシナリオ

1. 都道府県選択
   ```typescript
   test('都道府県の選択と解除', async ({ page }) => {
     await page.goto('/');
     await page.getByLabel('北海道').click();
     await expect(page.getByTestId('graph')).toBeVisible();
     await page.getByLabel('北海道').click();
     await expect(page.getByTestId('graph')).not.toBeVisible();
   });
   ```

2. 人口構成切替
   ```typescript
   test('人口構成の切り替え', async ({ page }) => {
     await page.goto('/');
     await page.getByLabel('北海道').click();
     await page.selectOption('select', '年少人口');
     await expect(page.getByText('年少人口')).toBeVisible();
   });
   ```

3. グラフ表示
   ```typescript
   test('グラフの表示と操作', async ({ page }) => {
     await page.goto('/');
     await page.getByLabel('東京都').click();
     await expect(page.getByTestId('graph-line')).toBeVisible();
     await page.hover('[data-testid="graph-point"]');
     await expect(page.getByTestId('tooltip')).toBeVisible();
   });
   ```

## テスト環境

### 1. 開発環境

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test"
  }
}
```

### 2. CI環境

```yaml
name: Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run E2E tests
        run: npm run test:e2e
```

## モック戦略

### 1. APIモック

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const handlers = [
  rest.get('/api/v1/prefectures', (req, res, ctx) => {
    return res(
      ctx.json([
        { prefCode: 1, prefName: '北海道' },
        { prefCode: 2, prefName: '青森県' }
      ])
    );
  }),
];

export const server = setupServer(...handlers);
```

### 2. コンポーネントモック

```typescript
jest.mock('../components/Graph', () => ({
  Graph: ({ data }) => <div data-testid="graph">{JSON.stringify(data)}</div>
}));
```

## テストデータ

### 1. フィクスチャー

```typescript
export const mockPrefectures = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 2, prefName: '青森県' }
];

export const mockPopulationData = {
  boundaryYear: 2020,
  data: [
    {
      label: '総人口',
      data: [
        { year: 1980, value: 12817 },
        { year: 1985, value: 12707 }
      ]
    }
  ]
};
```

## 品質メトリクス

### 1. カバレッジ要件

- Statements: 80%以上
- Branches: 80%以上
- Functions: 80%以上
- Lines: 80%以上

### 2. パフォーマンス要件

- テスト実行時間: 5分以内
- E2Eテスト実行時間: 10分以内

### 3. コード品質

- Sonarクオリティゲート
  - バグ: 0
  - 脆弱性: 0
  - コードスメル: 最小限
  - テストカバレッジ: 80%以上

## レポーティング

### 1. テストレポート

```typescript
// jest.config.js
module.exports = {
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'reports/junit',
      outputName: 'junit.xml',
    }],
    ['jest-html-reporter', {
      pageTitle: 'Test Report',
      outputPath: 'reports/test-report.html',
    }]
  ]
};
```

### 2. カバレッジレポート

```typescript
// jest.config.js
module.exports = {
  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage'
};
``` 