# AI-Driven Development Sample

Trello 風プロジェクト管理アプリを題材に、AI 駆動開発の雛形を示すリポジトリです。開発ルールは ChatGPT とともに作成した `base.txt` に定義し、Codex は必ず `base.txt` → ブランチ固有の `AI/function.md` の順で読み込み、必要に応じて `AGENTS.md` を更新します。本リポジトリはその運用を反映しています。

## ディレクトリ構成
- `src/app` Next.js App Router。共通 UI は `src/components`、ユーティリティは `src/utils`、型は `src/types`。
- `logic/` ビジネスロジック。`db/` CSV 永続化。`tests/` はロジックのみテスト。`scripts/` ツール。`assets/` 静的アセット。`AI/` にブランチごとの `function.md`。
- インポートは `@/*` が `src/` と `logic/` を解決。

## 開発ルール（要約）
- TypeScript strict を常時 ON。命名: components=PascalCase、logic=camelCase（機能名ベース）、DB ヘルパー=snake_case、types=PascalCase、utils=camelCase、API ルート=`route.ts`、CSS=kebab-case。
- UI: shadcn/ui + Tailwind。shadcn ラップは `src/components/ui` に置き、独自スタイルは最小限でコンポーネント分割優先。
- データ: `db/` に UTF-8・LF の CSV。1 行目ヘッダー必須、`order` 列で順序管理。ID は `generateId()` による UUIDv4 文字列のみ。文字列を二重引用符で囲まない。`null`/`undefined` を書かず空文字で表現。
- CSV IO は必ず `src/utils/csv/` の共通関数経由。全読み込み→追記→全書き戻し、ID 置換更新、削除は残行再生成。結果は `Result` で返し、logic/utils で throw 禁止。エラーは英語で簡潔にし、`console.error` でログ。
- コメント: すべての関数に JSDoc（概要・引数・戻り値・例外/Result）。ファイル先頭コメント禁止。英語のみ。
- テスト: 機能確定後にロジック層のみ作成（純粋関数のユニット、CSV IO のリポジトリ、タスク/プロジェクトの一連フローの統合）。UI テスト不要。
- ブランチ/PR: `main` 直 push 禁止。`feature/*` `fix/*` `refactor/*` `chore/*` で作業し `dev` → `main` の順に統合。PR 手順: ブランチ作成 → `AI/function.md` 更新 → 実装 → push → PR 作成 → （CI 通過後）開発者が `./scripts/review.sh` でローカル diff を生成しレビュー依頼 → 指摘対応 → テスト追加 → `dev` マージ。
- ルールや CI を更新したら、必ず本 README と `AI/DEVELOPMENT.md` を最新化する。

## 実行コマンド
```
npm install
npm run dev
npm run lint
npm run build
npm start
```
JavaScript 依存は `package-lock.json`、Python 依存は必要に応じて `requirements.txt` にピン留めします。
