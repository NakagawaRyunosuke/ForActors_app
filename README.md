# ForActors
---
## アプリへのリンク
~~[ForActors](https://victorious-cliff-038858200.1.azurestaticapps.net)~~　Azureのサービス切れで現在接続不可能（;_;)


### 用いた技術
フロントエンド：Vue.js、Vuetify、VueRouter、VueStore、VueLoading

バックエンド：Firebase、Firestore、Authentication、Azure Web Static App

### 主な機能
<dl>
    <dt>・全ユーザーの投稿したオーディション情報を閲覧</dt>
    <dd>Twitterのタイムラインのようにオーディション情報を閲覧することが可能</dd>
    <dd>お気に入りボタンを押すことで、プロフィールから閲覧可能</dd>
    <dt>・オーディション情報の投稿</dt>
    <dd>HOMEページの投稿ボタンからオーディション情報を投稿することが可能</dd>
    <dt>・ログアウト機能</dt>
    <dd>ヘッダーのログアウトボタンを押すことでログアウト可能</dd>
    <dt>・ユーザー検索機能</dt>
    <dd>検索ページからユーザー名を用いてユーザーのアカウントを検索可能</dd>
    <dd>他ユーザーをフォロー、メッセージを送るなどが可能</dd>
    <dd>他ユーザーの投稿したオーディション情報もしくはお気に入りに追加したオーディション情報を閲覧可能</dd>
    <dt>・プロフィールを閲覧、設定</dt>
    <dd>ユーザーのアイコン、名前、紹介文を編集可能</dd>
    <dd>今までの投稿を確認、削除可能とお気に入りの投稿確認</dd>
    <dt>・自分のフォロー、フォロワーの確認</dt>
    <dd>フォロー、フォロワーの数字を押すことでどのユーザーがフォロー、フォロワーなのか確認可能</dd>
    <dt>・他ユーザーとのメッセージ</dt>
    <dd>他ユーザーとメッセージのやりとりが可能</dd>
</dl>


### 改善点
・メッセージを送った際のアイコンが保存されているため、送られてきたメッセージのアイコンと現在のアイコンに矛盾が生じてしまう<br>
・プロフィールでフォーロー、フォロワーを確認する際も同じことが起きてしまう<br>
・ログイン時の待機時間

