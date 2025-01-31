# ディレクトリ構造

## 概要
プロジェクトのソースコードは`src`ディレクトリ以下に配置され、以下の構造で管理されます。

```
src/
├── components/        # Reactコンポーネント
│   ├── ui/           # 再利用可能なUIコンポーネント
│   ├── features/     # 機能特化コンポーネント
│   └── layouts/      # レイアウトコンポーネント
├── hooks/            # カスタムフック
├── utils/            # ユーティリティ関数
├── types/            # 型定義
├── services/         # APIサービス
└── styles/           # スタイル定義
```

## 各ディレクトリの役割

### components/ui/
再利用可能な基本的なUIコンポーネントを格納します。

**含まれるコンポーネント**:
- ボタン
- 入力フォーム
- チェックボックス
- ドロップダウン
- ローディングインジケータ
- グラフコンポーネント

### components/features/
特定の機能に特化したコンポーネントを格納します。

**含まれるコンポーネント**:
- 都道府県選択
- 人口グラフ表示
- データフィルター

**構造**:
```
features/
  ├── prefecture/
  │   ├── PrefectureSelector.tsx
  │   └── PrefectureList.tsx
  ├── population/
  │   ├── PopulationGraph.tsx
  │   └── PopulationTable.tsx
  └── filter/
      └── DataFilter.tsx
```

### components/layouts/
ページ全体のレイアウトを構成するコンポーネントを格納します。

**含まれるコンポーネント**:
- RootLayout（ベースレイアウト）
- Header
- Footer
- Container
- Grid

### hooks/
再利用可能なReactフックを格納します。

**含まれるフック**:
- `usePrefectures`: 都道府県データの取得と管理
- `usePopulation`: 人口データの取得と管理
- `useDebounce`: 入力値の遅延処理
- `useLocalStorage`: ローカルストレージの操作

### utils/
共通で使用する汎用的な関数を格納します。

**含まれる機能**:
- 数値フォーマット
- 日付操作
- 配列操作
- バリデーション
- 型ガード

**構造**:
```
utils/
  ├── format/
  │   ├── number.ts
  │   └── date.ts
  ├── validation/
  │   └── schema.ts
  └── types/
      └── guards.ts
```

### types/
プロジェクト全体で使用する型定義を格納します。

**含まれる型定義**:
- APIレスポンスの型
- コンポーネントのProps型
- ユーティリティ型
- 列挙型

**構造**:
```
types/
  ├── api/
  │   ├── prefecture.ts
  │   └── population.ts
  ├── components/
  │   └── props.ts
  └── utils/
      └── common.ts
```

### services/
外部APIとの通信やデータ操作を担当するサービスを格納します。

**含まれるサービス**:
- RESAS API通信サービス
- ローカルストレージサービス
- エラーハンドリングサービス
- キャッシュサービス

**構造**:
```
services/
  ├── api/
  │   ├── resasApi.ts
  │   └── apiClient.ts
  ├── storage/
  │   └── localStorage.ts
  └── cache/
      └── queryCache.ts
```

### styles/
プロジェクトのスタイリングに関連するファイルを格納します。

**含まれるファイル**:
- グローバルスタイル
- TailwindCSS設定
- カスタムユーティリティクラス
- カラーパレット定義
- アニメーション定義

**構造**:
```
styles/
  ├── globals.css
  ├── tailwind.config.js
  ├── colors.css
  └── animations.css
```

## 命名規則

### コンポーネント
- コンポーネントファイル: PascalCase（例: `Button.tsx`）
- テストファイル: コンポーネント名 + .test.tsx（例: `Button.test.tsx`）
- スタイルファイル: コンポーネント名 + .module.css（例: `Button.module.css`）

### フック
- フックファイル: camelCase、use接頭辞（例: `usePrefectures.ts`）
- テストファイル: フック名 + .test.ts（例: `usePrefectures.test.ts`）

### 型定義
- 型名: PascalCase
- インターフェース: 接頭辞 'I'（例: `IApiResponse`）
- 型エイリアス: 接尾辞 'Type'（例: `ResponseType`）

### サービス
- サービスクラス: 接尾辞 'Service'（例: `ResasApiService`）
- ファイル名: camelCase
- メソッド名: camelCase 