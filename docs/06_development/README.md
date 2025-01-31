# 開発ガイドライン

## コーディング規約

### 1. TypeScript

- strict modeを有効化
- any型の使用を禁止
- 明示的な型定義
- インターフェースの積極的な活用
- 型の再利用性を重視

### 2. React

- 関数コンポーネントの使用
- Hooks規約の遵守
- メモ化の適切な使用
- 副作用の最小化
- コンポーネントの単一責任

### 3. ファイル構成

```
src/
├── app/                    # ページルーティング
├── components/             # UIコンポーネント
│   ├── ui/                # 共通UIコンポーネント
│   └── features/          # 機能別コンポーネント
├── hooks/                 # カスタムフック
├── services/              # APIサービス
├── types/                 # 型定義
└── utils/                 # ユーティリティ関数
```

### 4. 命名規則

- コンポーネント: PascalCase
- 関数: camelCase
- 定数: UPPER_SNAKE_CASE
- ファイル: kebab-case
- テストファイル: *.test.tsx

## コードスタイル

### 1. ESLint設定

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### 2. Prettier設定

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

### 3. コンポーネント実装

```typescript
// 推奨パターン
import { memo } from 'react';
import type { FC } from 'react';

interface Props {
  title: string;
  onAction: () => void;
}

export const Component: FC<Props> = memo(({ title, onAction }) => {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Click me</button>
    </div>
  );
});

Component.displayName = 'Component';
```

## Git運用

### 1. ブランチ戦略

- main: プロダクション環境
- develop: 開発環境
- feature/*: 機能開発
- bugfix/*: バグ修正
- release/*: リリース準備

### 2. コミットメッセージ

```
feat: 新機能
fix: バグ修正
docs: ドキュメントのみの変更
style: コードスタイルの変更
refactor: リファクタリング
test: テストコードの変更
chore: ビルドプロセスなどの変更
```

### 3. プルリクエスト

- テンプレートの使用
- レビュアーの指定
- 適切な粒度での分割
- 自動テストの通過確認

## テスト

### 1. ユニットテスト

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Component } from './Component';

describe('Component', () => {
  it('should render title', () => {
    render(<Component title="Test" onAction={() => {}} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should call onAction when clicked', async () => {
    const onAction = jest.fn();
    render(<Component title="Test" onAction={onAction} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onAction).toHaveBeenCalled();
  });
});
```

### 2. E2Eテスト

```typescript
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/都道府県別人口推移/);
});
```

## パフォーマンス最適化

1. コード分割
2. 画像最適化
3. キャッシュ戦略
4. メモ化
5. バンドルサイズの最適化

## セキュリティ

1. 入力値のバリデーション
2. XSS対策
3. APIキーの保護
4. CORS設定
5. 依存パッケージの脆弱性チェック

## アクセシビリティ

1. セマンティックHTML
2. ARIA属性の適切な使用
3. キーボード操作
4. スクリーンリーダー対応
5. コントラスト比の確保 