# Requirements Definition Document
Trello-like Project Management Application  
AI-Driven Development Template Project

---

## 1. Purpose (目的)

本プロジェクトは、Trello のようなプロジェクト管理アプリの基盤を構築することを目的としている。  
しかし、機能の複雑性そのものよりも、**AI駆動開発（AI-driven development）のための雛形と基盤構築** を主要目的とする。

---

## 2. User Types (想定ユーザー)

- 個人開発者  
- 小規模チーム  
- AI駆動開発のテンプレートを学びたい開発者  

---

## 3. Overall Application Structure (アプリ全体構造)

アプリは次の 3 セクションで構成される：

1. **Landing Page（非ログインユーザー専用）**
2. **Auth Pages（Signup / Login）**
3. **App Pages（ログインユーザー専用）**

---

## 4. Landing Page Requirements

### 4.1 概要
- アプリの概要説明
- AI駆動開発の雛形であることを説明
- Signup / Login ボタンを右上に配置

### 4.2 リダイレクト
- ログインしていないユーザーは Landing Page 以外へ遷移した場合 **必ず Landing にリダイレクト**

### 4.3 文言ルール
- 文言はすべて `assets/translations/jp.ts` から読み込む  
- ベタ書き禁止

---

## 5. Authentication Requirements（認証）

### 5.1 認証方式
- メールアドレス + パスワード方式  
- **今回はパスワードのハッシュ化は行わず、そのまま保存する**  
  - ※セキュリティ目的ではないため（ローカルCSV目的）

### 5.2 保存情報（users.csv）
| id (UUIDv4) | email | password | created_at | updated_at |

### 5.3 認証状態
- ログインしていないユーザー → Landing Page に強制戻し
- ログイン後 → プロジェクト一覧へ遷移

---

## 6. Application Pages（Trello風）

ログイン後、ユーザーは Trello 風の UI に入る。

### 中核ドメインモデル
Project
└─ Board
└─ List (Column)
└─ Task (Card)


---

## 6.1 MVP要件

### Project
- 作成 / 削除 / 一覧表示

### Board
- 作成 / 削除 / 一覧表示

### List
- 作成 / 並び替え / 削除

### Task
- 作成 / 編集 / 移動 / 削除

---

## 7. CSV Schema（初期案）

### users.csv
| id | email | password | created_at |

### projects.csv
| id | user_id | name | created_at | updated_at | order |

### boards.csv
| id | project_id | name | created_at | order |

### lists.csv
| id | board_id | name | created_at | order |

### tasks.csv
| id | list_id | title | description | created_at | updated_at | order |

---

## 8. 非機能要件

- 全データは CSV で管理
- UTF-8 / LF (`\n`)
- ダブルクオート囲み禁止
- TypeScript strict
- shadcn/ui + tailwindcss
- 例外 throw 禁止、Result 型で返す
- ロジック層は logic/ に全て集約
- 文言は translations/jp.ts に集約

---

## 9. Feature List（機能一覧）

### Auth
- signup_user
- login_user
- logout_user

### Project
- create_project  
- delete_project  
- list_projects  

### Board
- create_board  
- list_boards  
- delete_board  

### List
- create_list  
- update_list_order  
- delete_list  

### Task
- create_task  
- update_task  
- move_task  
- delete_task  

---

## 10. Development Flow（AI駆動開発フロー）

1. 機能を選ぶ  
2. ブランチ切る（feature/<name>）  
3. function.md 作成  
4. Agent.md に反映  
5. Codex 実装  
6. PR → AIレビュー  
7. 修正  
8. テスト生成  
9. dev → main  

---

## 11. 備考
- 本ドキュメントはアプリ側の真実（SSOT）であり、機能追加があれば随時更新する。

