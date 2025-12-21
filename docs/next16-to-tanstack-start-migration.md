## Next.js 16 から TanStack Start への移行ガイド（dashboard-playground-nextjs）

### 概要

このドキュメントは、`dashboard-playground-nextjs` プロジェクトを **Next.js 16 (App Router)** から **TanStack Start（React）** に移行するための手順をまとめたものです。  
実際のディレクトリ構成（`app/`, `lib/`, `components/ui/*` など）を前提に、移行方針・マッピング・作業ステップ・確認観点を整理しています。

---

## 1. 方針と前提

### 1-1. ゴール

- Next.js 16 / App Router ベースのアプリを、**TanStack Start + Vite + @tanstack/react-router** ベースのフルスタックアプリに移行する。
- 既存の UI コンポーネントやドメインロジック（DB, services, validation など）は **極力再利用** する。

### 1-2. 技術的な前提

- React 18 / TypeScript を利用している。
- データアクセスやビジネスロジックは以下のように `lib/` 配下へ集約されている:
  - `lib/db/client.ts`
  - `lib/db/schema.ts`
  - `lib/db/repositories/task-repository.ts`
  - `lib/db/services/task-service.ts`
  - `lib/validation/task-validation.ts`
  - `lib/validation/task-query-validation.ts`
  - `lib/request.ts`, `lib/result.ts`, `lib/errors.ts`
- UI コンポーネントとして shadcn/ui 由来の `components/ui/*` や、アプリ固有のコンポーネント（`app/components/*`, `app/tasks/components/*`）が存在する。

### 1-3. Next.js と TanStack Start の主な違い（ざっくり）

- **ルーティング**
  - Next.js: `app/tasks/page.tsx`, `app/tasks/[id]/edit/page.tsx` など、App Router ベースのファイルルーティング。
  - TanStack Start: `app/routes/tasks/index.tsx`, `app/routes/tasks/$id.edit.tsx` など、`@tanstack/react-router` ベースのファイルルーティング。
- **サーバーコード**
  - Next.js: `'use server'` を付与した Server Actions や Route Handlers。
  - TanStack Start: `createServerFn` や ルートごとの `loader` / `action` を用いたサーバーファンクション。
- **ビルド/実行基盤**
  - Next.js: Next 専用のビルドシステムと Dev サーバ。
  - TanStack Start: Vite ベースのビルドと Dev サーバ。

---

## 2. 新規 TanStack Start プロジェクトの準備

Next.js プロジェクトを直接書き換えるのではなく、**別ディレクトリに TanStack Start プロジェクトを新規作成し、そちらにコードを移植していく**方針を取ります。

### 2-1. プロジェクト作成

TanStack Start (React) の Getting Started に従い、新しいプロジェクトを作成します:

```bash
# 任意の場所で
pnpm create @tanstack/start@latest my-dashboard-start
cd my-dashboard-start
pnpm install
```

セットアップ時の推奨選択:

- **Framework**: React
- **Language**: TypeScript
- **CSS**: Tailwind or PostCSS（既存の `globals.css` を移植する予定ならどちらでも可）

以降、この新規プロジェクト（例: `my-dashboard-start`）を「**Start プロジェクト**」、既存の Next.js プロジェクトを「**Next プロジェクト**」と呼びます。

---

## 3. ルーティングのマッピング

### 3-1. 現在の主要ルート（Next プロジェクト）

このリポジトリで想定される主なページ:

- ダッシュボードトップ: `app/page.tsx`
- タスク一覧: `app/tasks/page.tsx`
- タスク作成: `app/tasks/create/page.tsx`
- タスク編集: `app/tasks/[id]/edit/page.tsx`
- 共通レイアウト: `app/layout.tsx`

### 3-2. TanStack Start でのルートファイル設計

TanStack Start (React) では、`app/routes` ディレクトリにルートを配置します。  
Next.js のルートを下記のように対応づけます:

| 画面             | Next.js ルート                        | TanStack Start ルートファイル              |
|------------------|--------------------------------------|--------------------------------------------|
| ダッシュボード   | `app/page.tsx`                      | `app/routes/index.tsx`                     |
| タスク一覧       | `app/tasks/page.tsx`                | `app/routes/tasks/index.tsx`               |
| タスク作成       | `app/tasks/create/page.tsx`         | `app/routes/tasks/create.tsx`              |
| タスク編集       | `app/tasks/[id]/edit/page.tsx`      | `app/routes/tasks/$id.edit.tsx` など      |

補足:

- TanStack Router では `$id` が動的セグメント、`.` によってサブパスを表現できます。
- ルートの定義自体は `createRootRoute`, `createRoute` などを通して行われます（詳しくは TanStack Start / Router のドキュメント参照）。

---

## 4. レイアウトとグローバルスタイルの移行

### 4-1. `app/layout.tsx` → Root Route へ

Next.js の `app/layout.tsx` は、Start の「Root Route」に相当します。

レイアウト内で使用している主なコンポーネント:

- `app/components/AppHeader`
- `app/components/AppSidebar`
- `app/components/PageContainer`
- その他、レイアウト用のラッパコンポーネント

**移行方針**

1. Next プロジェクトの `app/components/*` を Start プロジェクトの `app/components/*` にコピーします。
2. Start プロジェクトの Root Route ファイル（例: `app/routes/__root.tsx` など）を作成し、`<AppHeader />`, `<AppSidebar />`, `<PageContainer />` で `<Outlet />` をラップする形に構成します。
3. Next.js 特有の API（例: `next/navigation` の `useRouter`）を使用している場合は、後述の手順に従い `@tanstack/react-router` の API へ置き換えます。

### 4-2. グローバル CSS (`app/globals.css`) の移行

Next プロジェクトのグローバル CSS:

- `app/globals.css`

**手順**

1. `app/globals.css` を Start プロジェクト側へコピーします。
   - 例: `app/styles/globals.css`
2. Start 側のエントリーポイント（公式サンプルにある `import appCss from '../styles/app.css?url'` 等）に従い、グローバル CSS を読み込みます。
3. 必要に応じて Tailwind 設定や PostCSS 設定を Start プロジェクト側に追加します。

---

## 5. UI コンポーネントの再利用

### 5-1. shadcn/ui コンポーネント (`components/ui/*`)

Next プロジェクトには以下のような UI コンポーネントがあります:

- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/dialog.tsx`
- `components/ui/dropdown-menu.tsx`
- `components/ui/form.tsx`
- `components/ui/input.tsx`
- `components/ui/select.tsx`
- `components/ui/sheet.tsx`
- `components/ui/sidebar.tsx`
- `components/ui/skeleton.tsx`
- `components/ui/textarea.tsx`
- `components/ui/tooltip.tsx`

これらは基本的に **React + TypeScript のプレーンコンポーネント**なので、Start プロジェクトでもそのまま利用可能です。

**手順**

1. `components/ui` ディレクトリを Start プロジェクトにコピーします。
2. `tsconfig.json` のパスエイリアスを、Next プロジェクトと同様（またはそれに近い形）に設定して、`@/components/ui/button` などの import が通るようにします。
3. Radix UI や Tailwind に依存している場合は、Start プロジェクト側に必要な依存を追加します。

### 5-2. アプリ固有コンポーネント

対象例:

- `app/components/AppHeader/*`
- `app/components/AppSidebar/*`
- `app/components/PageContainer/*`
- `app/components/TaskStatistics/*`
- `app/tasks/components/TaskList/*`
- `app/tasks/components/TaskFilters/*`
- `app/tasks/components/TaskForm/*`
- `app/tasks/[id]/edit/components/*`

**手順**

1. これらのコンポーネントを Start プロジェクトの `app/components` などにコピーします。
2. `next/link` や `next/navigation` など Next.js 固有の import がないか確認し、後述の `@tanstack/react-router` の API に置き換えます。
3. 依存しているドメインロジック（`lib/` 以下）も合わせてコピーし、import パスを修正します。

---

## 6. データアクセス層・サーバー処理の移行

### 6-1. DB / Repository / Service の再利用

Next プロジェクトでは、おそらく以下のような構成で DB ロジックが分離されています:

- `lib/db/client.ts`
- `lib/db/schema.ts`
- `lib/db/repositories/task-repository.ts`
- `lib/db/services/task-service.ts`

また、バリデーションや共通ユーティリティ:

- `lib/validation/task-validation.ts`
- `lib/validation/task-query-validation.ts`
- `lib/request.ts`
- `lib/result.ts`
- `lib/errors.ts`
- `lib/cache/tags.ts`

これらは Next.js 依存が薄い（あるいは全くない）ため、**Start プロジェクトへファイルごとコピーして問題ありません**。

### 6-2. Next.js Server Actions / actions ディレクトリ

Next プロジェクトには、以下のような Server Action 的なファイルが存在します:

- `app/actions/dashboard.ts`
- `app/tasks/actions/tasks.ts`

これらは Next.js の `'use server'` を前提とした「サーバー関数」ですが、Start 側では **`createServerFn`** を利用して同様の機能を実現します。

#### 変換イメージ

- **Before（Next.js）**

```ts
// app/tasks/actions/tasks.ts
'use server'

export async function createTask(input: CreateTaskInput) {
  // drizzle 経由で DB に insert
}
```

- **After（TanStack Start）**

```ts
// app/server/tasks.ts （例）
import { createServerFn } from '@tanstack/react-start'
import { taskService } from '~/lib/db/services/task-service'

export const createTask = createServerFn({ method: 'POST' }).handler(
  async (input: CreateTaskInput) => {
    return taskService.create(input)
  },
)
```

フロントエンドからは、この `createTask` server function を直接呼び出したり、フォームの submit ハンドラから利用したりします（詳しくは TanStack Start の server functions ドキュメントを参照）。

### 6-3. ルートごとの loader / action への分割

TanStack Start では、ルートファイルに `loader` や `action` を定義して、データの取得や更新を行います（`@tanstack/react-router` の loader/action 機能）。

代表的なマッピング:

- `app/tasks/page.tsx` → `app/routes/tasks/index.tsx`
  - タスク一覧取得ロジックを loader に移し、`useLoaderData` 相当の方法で画面に渡す。
- `app/tasks/create/page.tsx` → `app/routes/tasks/create.tsx`
  - フォーム submit から `createTask` server function を呼び出す。
- `app/tasks/[id]/edit/page.tsx` → `app/routes/tasks/$id.edit.tsx`
  - loader で対象タスクを取得し、action または server function で更新する。

---

## 7. ルーティングとナビゲーションの書き換え

### 7-1. Link / Router の置き換え

Next.js と TanStack Router の主な違い:

| 概念              | Next.js                              | TanStack Router (`@tanstack/react-router`)          |
|-------------------|--------------------------------------|-----------------------------------------------------|
| Link コンポーネント | `import Link from 'next/link'`       | `import { Link } from '@tanstack/react-router'`     |
| ルーター取得       | `import { useRouter } from 'next/navigation'` | `import { useRouter } from '@tanstack/react-router'` |
| ページ遷移         | `router.push('/tasks')`             | `router.navigate({ to: '/tasks' })`                 |

**作業手順**

1. すべての `next/link` の import を `@tanstack/react-router` の `Link` に置き換える。
2. すべての `next/navigation` の `useRouter` を削除し、`@tanstack/react-router` からの `useRouter` に変更する。
3. `router.push('...')` などの呼び出しを `router.navigate({ to: '...' })` へ書き換える。

### 7-2. URL パラメータ・クエリパラメータの扱い

Next プロジェクトでは、以下のようにクエリパラメータを扱っている可能性があります:

- `app/tasks/lib/nuqs/searchParams.ts` で `nuqs` を利用している

TanStack Router では、**search params 機能**を利用できます。

**方針**

- nuqs による searchParams 管理を、`@tanstack/react-router` の search params 機能へ移行する。
- ルートごとに search schema を定義し、`useSearch` などで型安全に参照・更新する。

---

## 8. タスク機能ごとの移行チェックリスト

このセクションは、実際の作業時に利用するためのチェックリストです。

### 8-1. タスク一覧 (`TaskList`)

関連ファイル（例）:

- `app/tasks/components/TaskList/container.tsx`
- `app/tasks/components/TaskList/presentational.tsx`
- `app/tasks/components/TaskList/components/TaskItem/*`

**手順**

1. すべての TaskList 関連コンポーネントを Start プロジェクトへコピーする。
2. データ取得部分を、`app/routes/tasks/index.tsx` の loader から渡される props を利用する形に変更する。
3. ページング・フィルタリングなど、URL クエリと連動している部分を TanStack Router の search params で実装する。

### 8-2. タスクフィルタ (`TaskFilters`)

関連ファイル（例）:

- `app/tasks/components/TaskFilters/*`

**手順**

1. UI コンポーネントを Start プロジェクトにコピー。
2. 状態と URL の同期を TanStack Router の search params に移行。
3. 検索フォーム submit 時の `router.push` を `router.navigate({ to: '/tasks', search: ... })` などに置き換え。

### 8-3. タスク作成 / 編集フォーム

関連ファイル（例）:

- `app/tasks/components/TaskForm/*`
- `app/tasks/[id]/edit/components/EditTaskForm.tsx`

**手順**

1. フォーム UI コンポーネントを Start プロジェクトにコピー。
2. バリデーション（`lib/validation/task-validation.ts`）をそのまま利用する。
3. submit ハンドラで呼び出している Next.js Server Action を、`createServerFn` ベースの server function に差し替える。
4. 成功時の遷移を `router.navigate` で実装する。

---

## 9. ビルド設定・スクリプトの移行

### 9-1. Next.js 特有のファイル/設定

TanStack Start への完全移行後は、以下のファイルは不要になります:

- `next.config.ts`
- `next-env.d.ts`
- `app/` ディレクトリ（Next.js 用のもの）

`public/` 配下（`next.svg`, `vercel.svg`, `globe.svg` など）は、必要に応じて Start プロジェクトの `public/` にコピーできます。

### 9-2. package.json の依存関係

概念的な整理:

- **削除候補**
  - `next`
  - Next.js 専用の型やプラグイン
- **追加（Start テンプレート側でほぼ自動）**
  - `@tanstack/react-router`
  - `@tanstack/react-start`
  - `vite`
  - `@vitejs/plugin-react-swc` など

最終的には、Start プロジェクト側の `package.json` を基準とし、Next プロジェクト固有の依存のみ手動で移植する形がおすすめです。

---

## 10. 動作確認の観点

移行が完了したら、以下の観点で動作を確認します。

### 10-1. ルーティング

- `/` でダッシュボードトップが正しく表示される。
- `/tasks` でタスク一覧が表示される。
- `/tasks/create` でタスク作成画面が表示される。
- `/tasks/:id/edit` でタスク編集画面が表示される。

### 10-2. タスク作成/編集

- 不正な入力時にバリデーションエラーが正しく表示される。
- 正常に作成・更新できる。
- 作成・編集後に期待どおりのページへ遷移する（例: 一覧ページ）。

### 10-3. フィルタ/検索

- 検索・フィルタリングの条件が URL のクエリパラメータと同期している。
- ページをリロードしても検索条件が保持される。

### 10-4. SSR / 初期データ読み込み

- 直接 URL へアクセスした場合でも、必要なデータがサーバーサイドで取得されている。

---

## 11. 実務的な進め方（ロードマップ）

最小のリスクで移行するための、推奨ロードマップです。

1. **TanStack Start プロジェクトを新規作成**（別ディレクトリ）。
2. **DB / services / validation / utils を Start プロジェクトへコピー**。
3. **レイアウト (`app/layout.tsx`) を Root Route に移植**し、グローバルな UI を再現。
4. **トップページ (`app/page.tsx`) を `app/routes/index.tsx` として移植**。
5. **タスク一覧 (`app/tasks/page.tsx`) を `app/routes/tasks/index.tsx` として移植**し、TaskList / TaskFilters を接続。
6. **タスク作成・編集ページをそれぞれのルートに移植**し、server functions を使って DB と連携。
7. **nuqs による searchParams を、TanStack Router の search params 機能へ順次置き換え**。
8. すべての機能が Start プロジェクト上で動作することを確認したら、Next プロジェクト側をアーカイブ or 削除。

---

## 12. 追加メモ

- 特定の画面や機能について「Before (Next.js) → After (TanStack Start) のコード比較」が必要になった場合は、個別にサンプルを追加することを推奨します。
- このドキュメントはプロジェクトルートの README からリンクしておくと、チームメンバーが移行方針を把握しやすくなります。


