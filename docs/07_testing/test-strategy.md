# テスト戦略

## テスト方針

このプロジェクトでは、以下の4つのレベルでテストを実施します：

1. **ユニットテスト** (Jest + React Testing Library)
2. **コンポーネントテスト** (Storybook)
3. **統合テスト** (Jest + React Testing Library)
4. **E2Eテスト** (Playwright)

## カバレッジ目標

- ユニットテスト: 80%以上
- 統合テスト: 重要なユーザーフロー100%
- E2Eテスト: クリティカルパス100%

## テスト実行環境

### ローカル開発環境

```bash
# ユニットテスト
npm run test

# 特定のテストファイルの実行
npm run test path/to/test

# カバレッジレポート生成
npm run test:coverage

# E2Eテスト
npm run test:e2e

# Storybookテスト
npm run storybook:test
```

### CI環境

- プルリクエスト時に自動実行
- main/developブランチへのマージ時に実行
- デプロイ前の品質ゲートとして使用

## テスト種別詳細

### 1. ユニットテスト

#### 対象
- ユーティリティ関数
- カスタムフック
- 個別のコンポーネント
- APIクライアント
- バリデーション

#### 例

```typescript
// ユーティリティ関数のテスト
describe('formatPopulationData', () => {
  it('should format raw API data correctly', () => {
    const raw = { ... }
    const expected = { ... }
    expect(formatPopulationData(raw)).toEqual(expected)
  })
})

// カスタムフックのテスト
describe('usePrefectureData', () => {
  it('should fetch and return prefecture data', async () => {
    const { result } = renderHook(() => usePrefectureData())
    await waitFor(() => {
      expect(result.current.data).toBeDefined()
    })
  })
})
```

### 2. コンポーネントテスト (Storybook)

#### 対象
- UIコンポーネント
- 機能コンポーネント
- レイアウトコンポーネント

#### 実装方針
- 各コンポーネントのストーリーを作成
- インタラクションテストの追加
- アクセシビリティテストの実施

#### 例

```typescript
// Button.stories.tsx
export default {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary']
    }
  }
}

export const Primary = {
  args: {
    variant: 'primary',
    children: 'ボタン'
  }
}
```

### 3. 統合テスト

#### 対象
- コンポーネント間の連携
- データフローの検証
- 状態管理の検証

#### 例

```typescript
describe('Prefecture Selection Flow', () => {
  it('should update chart when prefecture is selected', async () => {
    render(
      <AppProvider>
        <PrefectureSelector />
        <PopulationChart />
      </AppProvider>
    )

    // 都道府県選択
    fireEvent.click(screen.getByLabelText('東京都'))

    // グラフ更新の確認
    await waitFor(() => {
      expect(screen.getByRole('figure')).toBeInTheDocument()
    })
  })
})
```

### 4. E2Eテスト

#### 対象シナリオ
1. 都道府県選択からグラフ表示まで
2. 複数都道府県の選択と解除
3. 人口種別の切り替え
4. エラー状態の確認

#### 例

```typescript
test('complete user journey', async ({ page }) => {
  await page.goto('/')
  
  // 都道府県選択
  await page.click('text=東京都')
  
  // グラフ表示待機
  await page.waitForSelector('role=figure')
  
  // 人口種別切り替え
  await page.click('text=年少人口')
  
  // グラフ更新確認
  await expect(page.locator('role=figure')).toBeVisible()
})
```

## アクセシビリティテスト

### 実施方法
1. Jest Axeによる自動テスト
2. Storybookのa11yアドオン
3. スクリーンリーダーでの手動テスト

### 例

```typescript
describe('Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(<PrefectureSelector />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

## パフォーマンステスト

### 測定項目
- Lighthouseスコア
- Core Web Vitals
- バンドルサイズ

### 実施タイミング
- プルリクエスト時
- 本番デプロイ時
- 定期的な監視

## テスト環境設定

### Jest設定

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
  ],
}
```

### Playwright設定

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 12'] },
    },
  ],
})
```

## 継続的改善

### モニタリング
- テストカバレッジの追跡
- テスト実行時間の監視
- 失敗テストの分析

### 定期的なレビュー
- テスト戦略の見直し
- テストケースの最適化
- 新しいテスト手法の導入検討 