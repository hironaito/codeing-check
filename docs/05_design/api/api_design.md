# API設計書

## 1. API概要

### 1.1 基本情報
- ベースURL: `https://api.example.com/v1`
- プロトコル: HTTPS
- データフォーマット: JSON
- 文字エンコーディング: UTF-8

### 1.2 共通仕様
#### リクエストヘッダー
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

#### レスポンスフォーマット
```json
{
  "status": "success" | "error",
  "data": {
    // レスポンスデータ
  },
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ"
  },
  "meta": {
    "timestamp": "2024-01-31T12:00:00Z"
  }
}
```

## 2. 認証・認可

### 2.1 認証エンドポイント
#### ログイン
```
POST /auth/login
```
リクエスト:
```json
{
  "email": "string",
  "password": "string"
}
```
レスポンス:
```json
{
  "status": "success",
  "data": {
    "token": "string",
    "expires_at": "datetime",
    "user": {
      "id": "uuid",
      "email": "string",
      "name": "string"
    }
  }
}
```

#### ログアウト
```
POST /auth/logout
```
レスポンス:
```json
{
  "status": "success",
  "data": {
    "message": "ログアウトしました"
  }
}
```

### 2.2 認可制御
- RBAC（Role Based Access Control）
- JWT（JSON Web Token）による認証
- スコープベースの権限管理

## 3. ユーザー管理API

### 3.1 ユーザー作成
```
POST /users
```
リクエスト:
```json
{
  "email": "string",
  "password": "string",
  "first_name": "string",
  "last_name": "string",
  "phone_number": "string"
}
```
レスポンス:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "string",
      "first_name": "string",
      "last_name": "string",
      "created_at": "datetime"
    }
  }
}
```

### 3.2 ユーザー取得
```
GET /users/{id}
```
レスポンス:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "string",
      "first_name": "string",
      "last_name": "string",
      "phone_number": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  }
}
```

### 3.3 ユーザー更新
```
PUT /users/{id}
```
リクエスト:
```json
{
  "first_name": "string",
  "last_name": "string",
  "phone_number": "string"
}
```
レスポンス:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "string",
      "first_name": "string",
      "last_name": "string",
      "phone_number": "string",
      "updated_at": "datetime"
    }
  }
}
```

### 3.4 ユーザー削除
```
DELETE /users/{id}
```
レスポンス:
```json
{
  "status": "success",
  "data": {
    "message": "ユーザーを削除しました"
  }
}
```

## 4. プロフィール管理API

### 4.1 プロフィール取得
```
GET /users/{id}/profile
```
レスポンス:
```json
{
  "status": "success",
  "data": {
    "profile": {
      "id": "uuid",
      "user_id": "uuid",
      "first_name": "string",
      "last_name": "string",
      "phone_number": "string",
      "birth_date": "date",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  }
}
```

### 4.2 プロフィール更新
```
PUT /users/{id}/profile
```
リクエスト:
```json
{
  "first_name": "string",
  "last_name": "string",
  "phone_number": "string",
  "birth_date": "date"
}
```
レスポンス:
```json
{
  "status": "success",
  "data": {
    "profile": {
      "id": "uuid",
      "user_id": "uuid",
      "first_name": "string",
      "last_name": "string",
      "phone_number": "string",
      "birth_date": "date",
      "updated_at": "datetime"
    }
  }
}
```

## 5. 設定管理API

### 5.1 設定取得
```
GET /users/{id}/settings
```
レスポンス:
```json
{
  "status": "success",
  "data": {
    "settings": {
      "id": "uuid",
      "user_id": "uuid",
      "preferences": {
        "theme": "light",
        "language": "ja",
        "notifications": {
          "email": true,
          "push": false
        }
      },
      "updated_at": "datetime"
    }
  }
}
```

### 5.2 設定更新
```
PUT /users/{id}/settings
```
リクエスト:
```json
{
  "preferences": {
    "theme": "dark",
    "language": "en",
    "notifications": {
      "email": true,
      "push": true
    }
  }
}
```
レスポンス:
```json
{
  "status": "success",
  "data": {
    "settings": {
      "id": "uuid",
      "user_id": "uuid",
      "preferences": {
        "theme": "dark",
        "language": "en",
        "notifications": {
          "email": true,
          "push": true
        }
      },
      "updated_at": "datetime"
    }
  }
}
```

## 6. エラーハンドリング

### 6.1 エラーコード
| コード | 説明 | HTTPステータス |
|--------|------|----------------|
| AUTH_001 | 認証エラー | 401 |
| AUTH_002 | 権限エラー | 403 |
| VAL_001 | バリデーションエラー | 400 |
| NOT_001 | リソース未検出 | 404 |
| SYS_001 | システムエラー | 500 |

### 6.2 エラーレスポンス例
```json
{
  "status": "error",
  "error": {
    "code": "VAL_001",
    "message": "入力値が不正です",
    "details": [
      {
        "field": "email",
        "message": "有効なメールアドレスを入力してください"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-31T12:00:00Z"
  }
}
```

## 7. レート制限

### 7.1 制限値
| エンドポイント | 制限 | 期間 |
|----------------|------|------|
| 認証API | 10 | 1分 |
| 一般API | 100 | 1分 |
| 管理API | 1000 | 1分 |

### 7.2 レスポンスヘッダー
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1706706000
```

## 8. バージョニング

### 8.1 バージョン管理
- URLパスによるバージョニング
- 例: `/v1/users`, `/v2/users`

### 8.2 バージョン移行
- 古いバージョンの非推奨化通知
- 新バージョンへの移行期間の設定
- 古いバージョンのサポート終了通知

## 9. キャッシュ制御

### 9.1 キャッシュヘッダー
```
Cache-Control: private, max-age=3600
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Last-Modified: Wed, 31 Jan 2024 12:00:00 GMT
```

### 9.2 キャッシュ戦略
- GETリクエストのキャッシュ
- 条件付きリクエストの利用
- キャッシュの無効化制御

## 10. ドキュメント

### 10.1 API仕様書
- OpenAPI (Swagger) 形式
- エンドポイントの詳細説明
- リクエスト/レスポンスの例
- 認証方法の説明

### 10.2 SDKとサンプル
- 各言語用のSDK提供
- サンプルコード
- クイックスタートガイド 