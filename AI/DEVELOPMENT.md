# 開発方針記録

AI 駆動開発の基盤・雛形をどのように構築したかを残す。

## 目的
- Trello 風アプリを題材に、AI が一貫して同じ規約で実装できる土台を用意する。
- 不変ルールを `base.txt` に集約し、各ブランチの `AI/function.md` と組み合わせてガイドする。

## 初期セットアップの流れ
1. ChatGPT と対話し、開発ルール・命名規則・CSV 運用・レビュー方針などを `base.txt` に記述。
2. Codex が `base.txt` を読み込み、ルールを反映した `AGENTS.md` を生成・更新。
3. ルールに沿ってディレクトリ整理を実施 (`src/`, `logic/`, `db/`, `tests/`, `scripts/`, `assets/`, `AI/` など)。
4. Next.js + Tailwind の雛形を `src/app` 配下に移動し、`@/*` エイリアスと `logic/` を解決可能に設定。

## 運用メモ
- 以降の開発でも、必ず `base.txt` → ブランチ固有の `AI/function.md` の順で読み込ませてから実装する。
- ルール更新があれば `base.txt` と `AGENTS.md` を同期し、本ファイルに履歴や方針変更を追記する。
- 翻訳ファイルは `assets/translations/` に置き、UI 文言はすべて翻訳経由で参照する。

## CI とドキュメント更新
- 最小限の CI（GitHub Actions で lint/build/test）を `.github/workflows/ci.yml` として追加後、初回コミットを作成。
- CI/ルールの変更時は README と本ファイルを必ず最新化すること。
