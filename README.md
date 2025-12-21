# 📊 Dashboard Playground

このプロジェクトは、TanStack Start の機能を試す、プレイグラウンド用のダッシュボードです。

## ✨ 主な機能

- 📈 タスク統計情報の表示（総数、ステータス別、優先度別、完了率）
- ✏️ タスクの作成、編集、削除
- 🔍 タスクの検索とフィルタリング

## 📷 ショーケース

https://github.com/user-attachments/assets/6cddd292-cd2a-4ae4-9db5-8210b4bd98f7

## 🛠️ 技術スタック

### フロントエンド

- **TanStack Start RC**
- **TypeScript**
- **Tailwind CSS 4**
- **shadcn/ui**

### バックエンド・データベース

- **Drizzle ORM** - ORM
- **SQLite (better-sqlite3)** - データベース
- **Zod** - バリデーション

### 状態管理・データフェッチ・フォーム

- **TanStack Query** - サーバー状態管理・データフェッチ
- **TanStack Form** - フォーム管理
- **Zustand** - クライアント状態管理

### 開発ツール

- **Vitest** - テストフレームワーク
- **Biome** - リンター・フォーマッター
- **Drizzle Kit** - データベースマイグレーション
- **Lefthook** - Git フック管理

## 🚀 セットアップ手順

### 前提条件

- **Node.js** 24.11.1
- **pnpm**（推奨）またはnpm/yarn/bun

### 1️⃣ 依存関係のインストール

```bash
pnpm install
```

### 2️⃣ データベースのセットアップ

#### 💻 Cursorを使用している場合

Cursorを使用している場合は、カスタムコマンドを利用できます：

**プロジェクト全体の初期セットアップ**には、次のカスタムコマンドが利用できます：

- `/init`  
  依存関係のインストール、データベースのセットアップ、開発サーバーの起動までの流れをガイドします。  
  詳細は [`.cursor/commands/init.md`](.cursor/commands/init.md) を参照してください。

- `/db-setup`  
  データベースのセットアップを行います（開発環境向け）。  
  詳細は [`.cursor/commands/db-setup.md`](.cursor/commands/db-setup.md) を参照してください。データベースの再セットアップも可能です。

#### 🔧 手動でセットアップする場合

**方法A: `db:push`を使用（開発環境推奨）**

```bash
# 既存データベースをリセットする場合 初回は不要（オプション）
rm -f local.db local.db-shm local.db-wal

# データベースの作成とシードデータの投入
pnpm db:push && pnpm db:seed
```

**方法B: `db:migrate`を使用（本番環境向け）**

```bash
# 既存データベースをリセットする場合（オプション）
rm -f local.db local.db-shm local.db-wal

# マイグレーションファイルの生成、マイグレーション実行、シードデータの投入
pnpm db:generate && pnpm db:migrate && pnpm db:seed
```

### 3️⃣ 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

## 🧪 テスト

```bash
# 単体テスト（CLI）
pnpm test

# 単体テスト（UI）
pnpm run test:ui
```

## 🏭 本番ビルド

### ビルド

```bash
pnpm build
```

ビルド成果物は `.output/` ディレクトリに出力されます：
- `.output/public/` - 静的ファイル（CSS, JS）
- `.output/server/` - サーバーコード

### 本番サーバーの起動

```bash
pnpm serve
```

サーバーが起動し、`http://localhost:3000` でアクセスできます。

> **注意**: 本番サーバーを起動する前に、データベース（`local.db`）が存在することを確認してください。

## 📝 利用可能なスクリプト

- `pnpm dev` - 🚀 開発サーバーを起動
- `pnpm build` - 📦 本番用ビルド
- `pnpm serve` - ▶️ 本番サーバーを起動
- `pnpm lint` - 🔍 リンターを実行
- `pnpm test` - 🧪 単体テストを実行（CLI）
- `pnpm run test:ui` - 🧪 単体テストを実行（UI）
- `pnpm format` - ✨ コードをフォーマット
- `pnpm db:push` - 🗄️ スキーマから直接データベースを更新（開発環境推奨）
- `pnpm db:generate` - 📄 マイグレーションファイルを生成
- `pnpm db:migrate` - 🔄 マイグレーションを実行
- `pnpm db:seed` - 🌱 シードデータを投入
- `pnpm db:studio` - 🎨 Drizzle Studioを起動（データベースGUI）

## 📁 プロジェクト構造

```
dashboard-playground-tanstack-start/
├── src/
│   ├── components/         # アプリケーションコンポーネント
│   │   ├── ui/            # shadcn/uiコンポーネント
│   │   └── ...            # その他の共通コンポーネント
│   ├── hooks/             # カスタムフック
│   ├── lib/
│   │   ├── cache/         # TanStack Query関連（queryKeys, queryOptions）
│   │   ├── db/            # データベース関連
│   │   │   ├── schema.ts      # Drizzleスキーマ
│   │   │   ├── repositories/  # リポジトリパターン
│   │   │   └── services/      # ビジネスロジック
│   │   ├── server/        # Server Functions
│   │   └── validation/    # Zodバリデーションスキーマ
│   ├── routes/            # TanStack Router ルート定義
│   │   ├── __root.tsx     # ルートレイアウト
│   │   ├── index.tsx      # ホームページ（ダッシュボード）
│   │   └── tasks/         # タスク関連のページとコンポーネント
│   └── router.tsx         # ルーター設定
├── drizzle/               # マイグレーションファイル
└── scripts/               # スクリプト（シードなど）
```
