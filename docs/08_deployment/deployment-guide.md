# デプロイメントガイド

## デプロイメント概要

このプロジェクトは、Vercelを使用して自動デプロイを行っています。

### デプロイメントフロー

1. GitHub上でのプルリクエストマージ
2. GitHub Actionsによる自動テスト
3. Vercelによる自動デプロイ
4. デプロイ後の自動テスト

## 環境構成

### 本番環境 (Production)
- URL: https://codeing-check-c4y4.vercel.app
- ブランチ: main
- 自動デプロイ: stagingブランチへのマージ時

## 環境変数設定

### 必要な環境変数

```bash
# API設定
NEXT_PUBLIC_API_ENDPOINT=
NEXT_PUBLIC_API_KEY=

# アプリケーション設定
NEXT_PUBLIC_APP_NAME=
NEXT_PUBLIC_APP_DESCRIPTION=
NEXT_PUBLIC_APP_URL=

# キャッシュ設定
NEXT_PUBLIC_CACHE_MAX_AGE=
NEXT_PUBLIC_STALE_WHILE_REVALIDATE=

# API設定
NEXT_PUBLIC_API_TIMEOUT=
NEXT_PUBLIC_API_RETRY_COUNT=
NEXT_PUBLIC_API_RETRY_DELAY=

# ログ設定
NEXT_PUBLIC_LOG_LEVEL=
```

### 環境変数の設定方法

1. Vercelダッシュボードでの設定
   - Project Settings > Environment Variables
   - 各環境ごとに適切な値を設定

2. ローカル開発環境での設定
   ```bash
   cp .env.example .env.local
   # .env.localを編集
   ```

## デプロイメント手順

### 自動デプロイ

1. プルリクエストの作成
   ```bash
   git checkout -b feature/new-feature
   git add .
   git commit -m "feat: 新機能を追加"
   git push origin feature/new-feature
   ```

2. GitHub Actionsでの自動テスト
   - リンターチェック
   - 型チェック
   - ユニットテスト
   - E2Eテスト

3. プルリクエストのマージ
   - レビュー承認後
   - すべてのチェックがパス

4. 自動デプロイの実行
   - Vercelによるビルドと最適化
   - デプロイ完了通知

### 手動デプロイ（緊急時）

```bash
# Vercel CLIのインストール
npm i -g vercel

# ログイン
vercel login

# デプロイ
vercel deploy

# 本番環境へのデプロイ
vercel deploy --prod
```

## デプロイ後の確認

### 自動チェック項目

1. Lighthouse CI
   - パフォーマンス
   - アクセシビリティ
   - SEO
   - ベストプラクティス

2. E2Eテスト
   - クリティカルパスの確認
   - レスポンシブ動作
   - クロスブラウザ対応

### 手動チェック項目

1. 機能確認
   - 都道府県選択
   - グラフ表示
   - データ更新

2. パフォーマンス確認
   - 初期読み込み時間
   - インタラクション応答性
   - メモリ使用量

3. 表示確認
   - レスポンシブ対応
   - ブラウザ互換性
   - フォント表示

## モニタリング

### パフォーマンスモニタリング

- Vercel Analytics
  - Real User Monitoring
  - Core Web Vitals
  - エラー追跡

### エラーモニタリング

- コンソールエラー
- API エラー
- パフォーマンス警告

### アラート設定

- デプロイ失敗時
- エラー率上昇時
- パフォーマンス低下時

## ロールバック手順

### 自動ロールバック

1. Vercelダッシュボードで前回のデプロイを選択
2. "Redeploy"ボタンをクリック

### 手動ロールバック

```bash
# 特定のデプロイメントにロールバック
vercel rollback [deployment-id]

# 直前のデプロイメントにロールバック
vercel rollback
```

## トラブルシューティング

### よくある問題と解決策

1. ビルドエラー
   - 依存関係の確認
   - キャッシュのクリア
   - 環境変数の確認

2. パフォーマンス問題
   - バンドルサイズの確認
   - 画像最適化の確認
   - キャッシュ設定の確認

3. API接続エラー
   - 環境変数の確認
   - CORSの設定確認
   - APIキーの有効性確認

### デバッグ手順

1. ログの確認
   ```bash
   vercel logs [deployment-id]
   ```

2. ビルド情報の確認
   ```bash
   vercel build-logs [deployment-id]
   ```

3. 環境変数の確認
   ```bash
   vercel env ls
   ```

## セキュリティ考慮事項

### デプロイメントセキュリティ

- 環境変数の暗号化
- アクセス制御の設定
- セキュアヘッダーの設定

### 監査

- 依存パッケージの脆弱性チェック
- セキュリティヘッダーの確認
- アクセスログの監査

## 継続的改善

### パフォーマンス最適化

- バンドルサイズの監視
- 画像最適化の改善
- キャッシュ戦略の最適化

### デプロイメントプロセス改善

- デプロイ時間の短縮
- テスト自動化の拡充
- モニタリングの強化 