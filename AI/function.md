📌 概要

この仕様では、/boards/[boardId] ページで List（カラム）と Task（カード）を管理する UI とロジックを実装する。

UI は Trello を参考にしており、shadcn/ui + TailwindCSS を使用する。

このページでは以下を行う：

Board に紐づく List の一覧表示

List の作成・削除

List 内に Task を作成

Task の編集（title + description）

Task のドラッグ＆ドロップによる移動（List 間 / List 内）

Task の並び順（order）更新

Task の削除

🎨 1. ワイヤーフレーム（ドラッグ＆ドロップ対応）
+---------------------------------------------------------------+
|  Board Name                                  [Add List]       |
+---------------------------------------------------------------+

   horizontally scrollable area
   ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
   │ LIST: "To Do"      │  │ LIST: "Doing"       │  │ LIST: "Done"        │
   ├────────────────────┤  ├────────────────────┤  ├────────────────────┤
   │ [ + Add Task ]     │  │ [ + Add Task ]      │  │ [ + Add Task ]      │
   │────────────────────│  │────────────────────│  │────────────────────│
   │  ● Task A           │  │  ● Task C           │  │  ● Task F           │
   │  (draggable)        │  │  (draggable)        │  │  (draggable)        │
   │                     │  │                     │  │                     │
   │  ● Task B           │  │  ● Task D           │  │  ● Task G           │
   │  (draggable)        │  │  (draggable)        │  │  (draggable)        │
   │────────────────────│  │────────────────────│  │────────────────────│
   │ [ ⋮ ] menu          │  │ [ ⋮ ] menu          │  │ [ ⋮ ] menu          │
   └────────────────────┘  └────────────────────┘  └────────────────────┘

🧲 2. Drag and Drop ライブラリ仕様

Next.js + shadcn/ui で相性がよいため、以下を採用：

✅ @dnd-kit/core

軽量

TypeScript 完備

SSR 安全

List 内 / List 間 の移動に最適

使用コンポーネント：

<DndContext>

<SortableContext>

useSortable

<DragOverlay>

🗂 3. CSV スキーマ（List / Task）

変更なし。ただし order の更新が頻発するので必須。

lists.csv
id, board_id, name, created_at, order

tasks.csv
id, list_id, title, description, created_at, updated_at, order

🧠 4. ロジック関数（logic/）— D&D 追加あり
LIST — 変更なし

createList

deleteList

getLists

TASK — D&D に伴う追加・修正
🆕 reorderTasksWithinList(listId: string, taskIdsInOrder: string[]): Result<null>

List 内でドラッグして並び順を変えた際に使う。

仕様

taskIdsInOrder の index がそのまま order になる

すべての該当タスクの order を一括更新

CSV 全書き換え方式で実装

🆕 moveTaskDnd(taskId: string, fromListId: string, toListId: string, newIndex: number): Result<Task>

List 間の移動時に使用。

仕様

task の list_id を toListId に更新

order = newIndex

newIndex 以降のタスクは order を +1 にシフト

fromList と toList の両方で order の整合性を保つ

既存関数

createTask

updateTask

deleteTask

🖥 5. UI コンポーネント構造
components/board/
  BoardPage.tsx               ← DndContext をここに配置
  ListColumn.tsx
  TaskCard.tsx                ← useSortable() を使用
  AddTaskButton.tsx
  AddListButton.tsx

BoardPage.tsx の責務

lists と tasks を読み込む

DndContext を配置

dragStart / dragEnd をハンドリングして logic 層を呼ぶ

ListColumn.tsx

SortableContext を置く

List 内の taskId 配列を context に渡す

TaskCard.tsx

useSortable() により draggable 化

overlay 時の見た目も設定

🔄 6. Drag & Drop の動作仕様（超重要）
▶ List 内移動（reorder）

user が List 内で Task を上下にドラッグ

DndContext の onDragEnd で

fromListId と toListId が同じ

並び順を更新

reorderTasksWithinList(listId, taskIdsInOrder) を呼ぶ

CSV 更新 → UI 再描画

▶ List 間移動（move）

user が Task を別 List にドラッグ

onDragEnd 判定 → listId が変わっている

moveTaskDnd(taskId, fromListId, toListId, newIndex) を呼ぶ

CSV 更新 → UI 再描画

🚦 7. テスト仕様（D&D 対応）
UNIT

reorderTasksWithinList

moveTaskDnd

INTEGRATION

listA に task を複数作成

並び替え → CSV の order が更新されているか

listB にタスク移動 → listId が変わり、order の整合性が保たれているか

✔️ 8. 完了条件

Task をマウスで List 内 / List 間に自由にドラッグできる

CSV 上でも order が正しく更新される

UI の見た目が崩れない

TypeScript strict OK

throw 禁止（Result 型のみ）

🔥 9. 次のアクション（ちゃっぴ君の提案）

これを現在の function.md に 完全置き換え

AGENTS.md も “Drag & Drop対応” に更新

ブランチ名は

feature/board-dnd


Codex に “D&D 対応 Board 実装お願いします” と依頼

PR → AIレビュー → 修正 → テスト作成