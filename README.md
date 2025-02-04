# 都道府県別人口推移グラフ

## 概要
このプロジェクトは、都道府県別の人口推移をグラフで可視化するWebアプリケーションです。
ゆめみフロントエンドコーディング試験の課題として作成されました。

## デモ
[https://codeing-check-c4y4.vercel.app/](https://codeing-check-c4y4.vercel.app/)

## 技術スタック
- フレームワーク: Next.js 15.1.6
- 言語: TypeScript 5.x
- スタイリング: Tailwind CSS
- グラフライブラリ: Recharts
- 状態管理: React Context API
- テスト:
  - Jest + React Testing Library（ユニットテスト）
  - Playwright（E2Eテスト）
  - Storybook（UIコンポーネントテスト）
  - Jest Axe（アクセシビリティテスト）

## 機能
- 都道府県の選択（複数選択可能）
- 人口推移の表示（総人口・年少人口・生産年齢人口・老年人口）
- レスポンシブ対応
- アクセシビリティ対応（WCAG 2.1 AAレベル準拠）

## 開発環境のセットアップ

### 必要条件
- Node.js 20.x以上
- npm 10.x以上

### インストール
```bash
# リポジトリのクローン
git clone https://github.com/naito-one/codeing-check.git
cd codeing-check

# 依存パッケージのインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集し、必要な環境変数を設定してください
```

### 開発サーバーの起動
```bash
npm run dev
```

### テストの実行
```bash
# ユニットテスト
npm run test

# テストカバレッジの確認
npm run test:coverage

# E2Eテスト
npm run test:e2e

# Storybookの起動
npm run storybook
```

### リンターとフォーマッター
```bash
# リンターの実行
npm run lint

# フォーマッターの実行
npm run format

# 型チェック
npm run type-check
```

## プロジェクト構成
```
src/
├── app/          # Next.js App Router
├── components/   # Reactコンポーネント
│   ├── ui/      # 汎用UIコンポーネント
│   ├── features/# 機能別コンポーネント
│   └── layouts/ # レイアウトコンポーネント
├── hooks/        # カスタムフック
├── services/     # APIサービス
├── store/        # グローバルステート
├── styles/       # グローバルスタイル
├── types/        # 型定義
└── utils/        # ユーティリティ関数
```

## コンポーネントドキュメント

各コンポーネントの詳細な使用方法とデモは、Storybookで確認できます：

```bash
# Storybookの起動
npm run storybook
```

### コンポーネントカテゴリ

- **UI Components**: 基本的なUIパーツ
  - Button
  - Input
  - Select
  - etc...
- **Feature Components**: 機能単位のコンポーネント
  - PrefectureList
  - PopulationChart
  - etc...
- **Layout Components**: レイアウト用コンポーネント
  - Header
  - Footer
  - etc...

## CI/CD
- GitHub Actionsによる自動化
  - リンターチェック
  - 型チェック
  - ユニットテスト
  - E2Eテスト
  - ビルドチェック
  - Lighthouseによるパフォーマンス計測

## ライセンス
このプロジェクトはMITライセンスの下で公開されています。

## 作者
Hiroki Naito
