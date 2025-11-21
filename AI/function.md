# Function: Board List Page  
`/projects/[projectId]/boards`

## Purpose
Projectをクリックしたときに遷移する「Board一覧ページ」を作成する。  
Board の一覧表示、作成、削除ができる最小構成とする。

---

## Scope

### この機能に含むもの
- `/projects/[projectId]/boards` ページ作成
- projectId に紐づく board 一覧表示
- board の新規作成
- board の削除
- Project名の表示（任意）
- 戻るボタン（Homeへ）

### 含まないもの
- Board を開いた中身（List/Task）
- ドラッグ＆ドロップ
- Board の編集・並び替え

---

## Page Behavior

### 1. ルーティング
`/projects/[projectId]/boards`

### 2. 認証リダイレクト
- 未ログイン → `/` へ redirect
- ログイン済み → 続行

### 3. projectId の検証
- `projects.csv` から `projectId` の存在確認
- 存在しなければ `/home` へ redirect（※安全性のため）

### 4. board 一覧
- `listBoards(projectId)` を呼ぶ
- `order` 昇順で表示
- カード UI（shadcn/ui）で一覧表示

### 5. board 作成
- 名前入力 → createBoard(name, projectId)
- CSV 追記
- 成功時に再フェッチ／再描画

### 6. board 削除
- 削除アイコンを押すと deleteBoard(id)
- 確認ダイアログは入れない（MVPのため）

---

## CSV Schema（boards.csv）
id, project_id, name, created_at, updated_at, order

yaml
Copy code

### Rules
- id: UUIDv4  
- project_id: string  
- name: string  
- order: number（昇順に表示）  
- created_at / updated_at: ISO8601  
- UTF-8 / LF  
- クオート禁止  
- NULL 禁止（空文字許可）

---

## Type Definitions（`types/board.ts`）
```ts
export interface Board {
  id: string;
  projectId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  order: number;
}
Repository / Logic
listBoards(projectId: string): Result<Board[]>
CSVを読み込む

project_id でフィルタ

order昇順に並べる

createBoard(name: string, projectId: string): Result<Board>
UUID作成

order = 最後の order + 1

createdAt / updatedAt = now()

CSVへ追記

deleteBoard(id: string): Result<null>
id に一致する行のみ除去した CSV を再生成

Components
BoardCard.tsx
Boardの名前と作成日時を表示

クリックで /projects/[projectId]/boards/[boardId]/lists に行く（※次フェーズ）

BoardCreateDialog.tsx
名前入力欄

キャンセル / 作成ボタン

ProjectHeader.tsx
Project名表示

“Back to Home” ボタン

Language selector（共通 Header 使用）

Translations（必要なキー）
pgsql
Copy code
boards.title
boards.create
boards.create_button
boards.name_placeholder
boards.empty
boards.created_at
boards.delete
boards.back
Routing
bash
Copy code
/home
/projects/[projectId]/boards
Tests（次のPRで追加）
listBoards（正しいソート）

createBoard（order の算出、timestamp）

deleteBoard（削除後の再構築）

projectId 不正時の redirect

Notes
この function.md は Board 一覧ページの実装に限定する。
Board 内の List/Task は別の function.md で扱う。