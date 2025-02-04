# コーディング規約

## 基本方針

- TypeScriptの厳格なルールを採用
- 保守性とパフォーマンスを重視
- アクセシビリティを考慮したコーディング
- チーム開発を意識した一貫性のある実装

## TypeScript / JavaScript

### 命名規則

```typescript
// コンポーネント: PascalCase
const UserProfile = () => { ... }

// 関数、変数: camelCase
const getUserData = () => { ... }
const userData = { ... }

// 定数: UPPER_SNAKE_CASE
const API_ENDPOINT = '...'

// 型定義: PascalCase
type UserData = { ... }
interface UserProps = { ... }

// ファイル名: kebab-case
// user-profile.tsx
// use-user-data.ts
```

### 型定義

```typescript
// 明示的な型定義を推奨
const user: User = { ... }

// any型の使用は禁止
// as による型アサーションは最小限に
```

### コンポーネント実装

```typescript
// 関数コンポーネントを使用
// アロー関数での実装を推奨
const Component: FC<Props> = ({ prop1, prop2 }) => { ... }

// propsの型定義は必須
interface Props {
  required: string
  optional?: number
}
```

## React

### フック規則

```typescript
// カスタムフックは'use'プレフィックスを使用
const useCustomHook = () => { ... }

// 依存配列は必ず指定
useEffect(() => {
  // 処理
}, [dependency])

// メモ化を適切に使用
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
```

### コンポーネント設計

- 単一責任の原則に従う
- 副作用は最小限に抑える
- プレゼンテーショナル/コンテナパターンの採用
- 適切なエラーバウンダリの実装

## スタイリング

### Tailwind CSS

```typescript
// クラス名の順序
// 1. レイアウト (display, position)
// 2. スペーシング (margin, padding)
// 3. サイズ (width, height)
// 4. 見た目 (color, background)
// 5. その他
<div className="
  flex absolute
  m-4 p-2
  w-full h-12
  bg-blue-500 text-white
  rounded-lg shadow-md
">
```

### CSS Modules

- コンポーネントスコープのスタイルに使用
- クラス名は明確で説明的に
- BEMライクな命名規則を採用

## テスト

### ユニットテスト

```typescript
describe('Component', () => {
  it('should render correctly', () => {
    // テストコード
  })

  it('should handle user interaction', () => {
    // テストコード
  })
})
```

### インテグレーションテスト

- 重要なユーザーフローのテストを必須に
- モックは最小限に

## Git

### コミットメッセージ

```bash
# 形式
type: Subject

# 例
feat: ユーザー認証機能を追加
fix: ログイン時のバリデーションエラーを修正
docs: READMEを更新
```

### ブランチ戦略

- feature/: 新機能開発
- fix/: バグ修正
- docs/: ドキュメント更新
- refactor/: リファクタリング

## エラーハンドリング

```typescript
// エラーバウンダリの実装
class ErrorBoundary extends React.Component {
  // 実装
}

// try-catchの適切な使用
try {
  // 危険な処理
} catch (error) {
  // エラーハンドリング
}
```

## パフォーマンス最適化

- 不要な再レンダリングを防ぐ
- 適切なメモ化の使用
- 遅延ローディングの活用
- バンドルサイズの最適化

## アクセシビリティ

- セマンティックなHTML
- ARIA属性の適切な使用
- キーボード操作のサポート
- スクリーンリーダー対応

## ツール設定

### ESLint

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    // プロジェクト固有のルール
  }
}
```

### Prettier

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

## CI/CD

- プルリクエスト時の自動チェック
- テストの自動実行
- ビルドの自動化
- デプロイの自動化 