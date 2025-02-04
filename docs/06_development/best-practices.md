# 開発ベストプラクティス

## コンポーネント設計

### 1. 単一責任の原則

```typescript
// 良い例
const PrefectureSelector = () => {
  return (
    <div>
      <RegionList />
      <PrefectureList />
    </div>
  )
}

// 避けるべき例
const PrefectureAndPopulationChart = () => {
  // 選択機能とグラフ表示が混在
}
```

### 2. カスタムフックによるロジックの分離

```typescript
// 良い例
const usePrefectureData = () => {
  const [data, setData] = useState<PrefectureData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // データ取得ロジック
  return { data, isLoading, error }
}

// コンポーネントでの使用
const PrefectureList = () => {
  const { data, isLoading, error } = usePrefectureData()
  // UIレンダリング
}
```

### 3. 適切なエラーハンドリング

```typescript
// エラーバウンダリの実装
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return <ErrorDisplay />
  }

  return children
}

// API呼び出しでのエラーハンドリング
const fetchData = async () => {
  try {
    const response = await api.get('/endpoint')
    return response.data
  } catch (error) {
    // エラーログの記録
    logger.error(error)
    // ユーザーフレンドリーなエラーメッセージ
    throw new Error('データの取得に失敗しました')
  }
}
```

## パフォーマンス最適化

### 1. メモ化の適切な使用

```typescript
// 高コストな計算の結果をメモ化
const memoizedValue = useMemo(() => {
  return expensiveCalculation(props.data)
}, [props.data])

// コールバック関数のメモ化
const memoizedCallback = useCallback(() => {
  doSomething(props.value)
}, [props.value])
```

### 2. レンダリング最適化

```typescript
// 条件付きレンダリング
{isLoading ? <LoadingSpinner /> : <Content />}

// リストレンダリングの最適化
const MemoizedListItem = memo(ListItem)
```

### 3. 遅延ローディング

```typescript
// コンポーネントの遅延ローディング
const LazyComponent = lazy(() => import('./LazyComponent'))

// 画像の遅延ローディング
<img loading="lazy" src="image.jpg" alt="説明" />
```

## アクセシビリティ

### 1. セマンティックHTML

```typescript
// 良い例
<main>
  <h1>メインタイトル</h1>
  <nav>
    <ul>
      <li><a href="#section1">セクション1</a></li>
    </ul>
  </nav>
  <section aria-labelledby="section1-heading">
    <h2 id="section1-heading">セクション1</h2>
    <p>コンテンツ</p>
  </section>
</main>
```

### 2. フォームアクセシビリティ

```typescript
// 良い例
<form onSubmit={handleSubmit}>
  <label htmlFor="prefecture">都道府県</label>
  <select
    id="prefecture"
    aria-describedby="prefecture-help"
    onChange={handleChange}
  >
    {/* オプション */}
  </select>
  <p id="prefecture-help">表示する都道府県を選択してください</p>
</form>
```

## テスト

### 1. ユニットテスト

```typescript
describe('PrefectureSelector', () => {
  it('should render all prefectures', () => {
    render(<PrefectureSelector prefectures={mockPrefectures} />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(47)
  })

  it('should handle prefecture selection', () => {
    const onSelect = jest.fn()
    render(<PrefectureSelector onSelect={onSelect} />)
    
    fireEvent.click(screen.getByLabelText('東京都'))
    expect(onSelect).toHaveBeenCalledWith('13')
  })
})
```

### 2. インテグレーションテスト

```typescript
test('complete user flow', async () => {
  render(<App />)
  
  // 都道府県選択
  await userEvent.click(screen.getByLabelText('東京都'))
  
  // データ読み込み待機
  await waitFor(() => {
    expect(screen.getByRole('figure')).toBeInTheDocument()
  })
  
  // グラフ表示確認
  expect(screen.getByText('人口推移')).toBeInTheDocument()
})
```

## 状態管理

### 1. Context APIの適切な使用

```typescript
// 状態の分割
const PrefectureContext = createContext<PrefectureContextType | null>(null)
const PopulationContext = createContext<PopulationContextType | null>(null)

// プロバイダーの階層化
const AppProvider = ({ children }) => (
  <PrefectureProvider>
    <PopulationProvider>
      {children}
    </PopulationProvider>
  </PrefectureProvider>
)
```

### 2. データフェッチング

```typescript
// APIクライアントの集中管理
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  headers: {
    'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY
  }
})

// データフェッチングフック
const usePopulationData = (prefCode: string) => {
  const [data, setData] = useState<PopulationData | null>(null)
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await apiClient.get(`/population/${prefCode}`)
      setData(response.data)
    }
    
    if (prefCode) {
      fetchData()
    }
  }, [prefCode])
  
  return data
}
```

## セキュリティ

### 1. 入力値のバリデーション

```typescript
// Zodによる型安全なバリデーション
const schema = z.object({
  prefCode: z.string().length(2),
  year: z.number().min(1960).max(2045)
})

// バリデーション実行
const validateInput = (input: unknown) => {
  try {
    return schema.parse(input)
  } catch (error) {
    throw new Error('入力値が不正です')
  }
}
```

### 2. APIキーの保護

```typescript
// 環境変数の使用
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

// APIキーの検証
if (!API_KEY) {
  throw new Error('API key is not defined')
}
```

## デプロイメント

### 1. 環境変数の管理

```bash
# .env.example
NEXT_PUBLIC_API_ENDPOINT=https://api.example.com
NEXT_PUBLIC_API_KEY=your_api_key_here

# 本番環境での設定
NEXT_PUBLIC_API_ENDPOINT=https://api.production.com
NEXT_PUBLIC_API_KEY=${PRODUCTION_API_KEY}
```

### 2. ビルド最適化

```bash
# next.config.js
module.exports = {
  // 画像最適化
  images: {
    domains: ['example.com'],
  },
  // バンドル分析
  webpack: (config, { isServer }) => {
    // webpack設定
    return config
  },
}
``` 