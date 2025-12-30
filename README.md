# NAIGAMES

NAIGAMEは、無料でプレイできるオリジナルゲームを配信するWebサイトです。

Web制作(Next.js / React / TypeScript)とゲーム開発(Python)の両面から
実務レベルのスキル向上と将来的なWebサイト運営を見据えた個人開発プロジェクトです。
当初ゲーム開発はPythonでの実装を進めましたが、Web上での動作不具合により、
JavaScriptによる開発に急遽変更となりました。


## デモ

※ 現在ローカル環境で開発が進行中。
※ Webサイト公開後も、機能の追加やデザインの更新など随時バージョンアップをします。
    URL：https://nai-site.com/


## プロジェクトの目的

* オリジナルゲーム開発によるJavaScriptスキル向上
* Next.js / React / TypeScriptを用いたWeb制作スキルの習得
* GitHubを使った実務に近い開発フローの実践
* 将来的を見据えて成果物を活用するための設計


## Webサイト構成

* Hero スライダー（自動再生・操作時停止・レスポンシブ対応）
* Game Collection（3列カードレイアウト）
* About / Contact（今後実装予定）
* Footer（ページ内リンク対応）

## 使用技術

### フロントエンド

* Next.js
* React
* TypeScript
* Tailwind CSS

### ゲーム開発

* JavaScript

### 開発環境・運用

* Git / GitHub
* VSCode
* Node.js / npm

## 技術的なポイント

* コンポーネント設計
Hero / GameCollection / About / Contact を分離し拡張性を確保

* データ駆動設計
画像・ゲーム情報は配列管理で追加・差し替えが容易

* UX 重視のスライダー実装

・自動スライド
・ホバー停止（PC）
・操作時一時停止
・レスポンシブ対応

## 現在の開発状況

* [x] Web サイト基盤構築
* [x] Hero スライダー実装
* [x] Game Collection 実装
* [x] About / Contact（仮）追加
* [ ] 各ゲームの詳細ページ
* [ ] JavaScript ゲームの組み込み
* [x] デプロイ（ConoHa）※テスト運用

## セットアップ方法

```bash
git clone https://github.com/naihito/naigames
cd naigames/site
npm install
npm run dev
```

ブラウザで
`http://localhost:3000`
にアクセス。

## 今後の予定

* ゲーム詳細ページの実装
* JavaScriptゲームの開発
* スマホ向け操作最適化
* 本番運用

## Author

* NAIGAMES
本プロジェクトは個人開発として継続的にアップデート予定です。
URL：https://nai-site.com/
現在はこちらのサイトでNAIGAMESをテスト運用していますが、
今後は様々なパターンのWebサイトをポートフォリオとして集約する総合サイトへ。
ポートフォリオとしてのクオリティを高めるとともに、幅広く対応できるスキル向上を考えています。
NAIGAMESはこの総合的なWebサイトの一部として運用する予定です。
