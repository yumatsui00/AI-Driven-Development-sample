## Test Requirements

- logic/配下unit test を作成する
  - email 重複チェックの正常/異常
  - password 空白チェック
  - Result<success/error> の返却が正しいか

- utils/csv/配下 の repository test を作成する
  - 新規行追加が CSV の末尾に追加される
  - 改行が LF であること
  - ダブルクオートを含まないこと

- Integration test
  - signup → CSV 保存 → login → 成功の一連をテストする