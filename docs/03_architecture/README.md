# アーキテクチャ設計書

## システム概要

本システムは、Next.js（App Router）を採用したモダンなウェブアプリケーションとして構築されています。

## アーキテクチャの特徴

### 1. クリーンアーキテクチャの採用

```
src/
├── app/              # ページルーティング
├── components/       # UIコンポーネント
│   ├── ui/          # 共通UIコンポーネント
│   └── features/    # 機能別コンポーネント
├── hooks/           # カスタムフック
├── services/        # APIサービス
├── types/           # 型定義
└── utils/           # ユーティリティ関数
```

### 2. コンポーネント設計

- Atomic Designの採用
  - atoms: 最小単位のUIコンポーネント
  - molecules: atomsの組み合わせ
  - organisms: 機能を持つ大きな単位
  - templates: ページレイアウト
  - pages: 実際のページコンポーネント

### 3. 状態管理

- React Context APIの活用
- カスタムフックによるロジックの分離
- サーバーサイドの状態管理（React Query）

### 4. パフォーマンス最適化

- 動的インポートによるコード分割
- 画像の最適化
- メモ化による不要な再レンダリングの防止
- Suspenseによる非同期処理の最適化

### 5. エラーハンドリング

- グローバルエラーバウンダリ
- API通信時のエラー処理
- ユーザーフレンドリーなエラーメッセージ

### 6. セキュリティ対策

- APIキーの安全な管理
- XSS対策
- CORS設定
- レート制限の実装

## 技術選定の理由

### Next.js
- SSRとSSGのハイブリッド対応
- 優れたDX（開発体験）
- 豊富なエコシステム

### TypeScript
- 型安全性の確保
- 開発効率の向上
- バグの早期発見

### Recharts
- React最適化
- カスタマイズ性
- パフォーマンス

## 非機能要件

### パフォーマンス
- First Contentful Paint: 1.5秒以内
- Time to Interactive: 3.0秒以内
- Lighthouse スコア: 90以上

### スケーラビリティ
- コンポーネントの再利用性
- 機能拡張の容易さ

### メンテナンス性
- コードの可読性
- ドキュメントの充実
- テストの網羅性

## 重要な前提条件

### API利用について
- ⚠️ **RESAS APIは2024年1月をもって廃止されました**
- 代替として、[YUMEMI Frontend Engineer Coding Test API](https://yumemi-frontend-engineer-codecheck-api.vercel.app)を使用します
- このAPIは、RESASと同様のデータを提供する互換APIとして実装されています

### APIエンドポイント
- Base URL: `https://yumemi-frontend-engineer-codecheck-api.vercel.app`
- 認証: APIキーをヘッダーに付与（`X-API-KEY`）

### ⚠️ 重要: エンドポイント仕様
以下のエンドポイントを**厳密に**使用してください：
1. 人口構成データ取得
   - エンドポイント: `/api/v1/population/composition/perYear`
   - ※ 必ず `/api/v1/` プレフィックスを含めてください
   - パラメータ: 
     - `prefCode`: 都道府県コード（必須）
     - `cityCode`: `-`（必須）

### APIレスポンス形式
```