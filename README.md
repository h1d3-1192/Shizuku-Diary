<div align="center">
  <h1>Shizuku 就活を応援するサポートモデル</h1>
  <img src="public/assets/thumbnail.png?raw=true" alt="サムネイル">

  [![Netlify Status](https://api.netlify.com/api/v1/badges/dee7e35d-e19a-459d-8f09-dab97e2cfb00/deploy-status)](https://waifu.sglkc.my.id)
  [![Issues](https://img.shields.io/github/issues/sglkc/waifu-otw.svg)](https://github.com/sglkc/waifu-otw/issues)
  [![MIT License](https://img.shields.io/github/license/sglkc/waifu-otw.svg)](LICENSE)

  クライアントサイドで動作する、自然言語処理、Live2D、音声認識機能を備えた人工知能です。

  <a href="https://github.com/sglkc/waifu-otw/issues">バグ報告</a>
  <strong>·</strong>
  <a href="https://github.com/sglkc/waifu-otw/issues">機能のリクエスト</a>
</div>

## こんにちは、私はしずく！

しずく(雫)は普通の10代の女の子です。

彼女のモデルは[Live2D Sample Model Collection](https://www.live2d.com/en/download/sample-data/)から、その他はインターネットからのもので、
私はここでいかなるアセットも所有権を主張しておらず、クレジットは正当な所有者に帰属します。

## このプロジェクトについて

これは卒業制作のテーマを就職活動とAIという切り口ですすめるために作成したもので、私の課題は利用者の就職活動を応援することです。
個人的に、プロンプトデザインといい、GeminiとLive2Dとの統合といいこれは私が今まで取り組んできた中で最も手の込んだプロジェクトです。

> 自然言語処理のための[@google/generative-ai](https://github.com/google-gemini/generative-ai-js/)、Live2D表示のための[pixi-live2d-display](https://github.com/guansss/pixi-live2d-display)、
> バンドルのための[Vite](https://vitejs.dev/)（そして型エラーのためのTypeScript！）に感謝します。

最初はプレーンなHTMLとJavaScriptで作成しましたが、保守が難しすぎ、理解しにくいハックが多すぎることに気づきました。

## 機能

このプロジェクトの主な焦点はチャットであり、他のものはそれほど重要ではありません。できること、できるかもしれないことのリストを以下に示します。

### 多言語でのチャット

現在、英語、インドネシア語、日本語をサポートしています。別の言語でチャットを開始すると、AIは自動的に言語を推測するはずです。
これは、AIに複数のデータを用意することで可能にしております。

### Live2D

これは最も視覚的な要素であり、メガバイト単位のLive2Dアセットをダウンロードするためにあなたのデータ容量を消費する以外に目的はありません。
しかし、Live2DはNLPに接続されているため、モデルは特定のメッセージの意図に反応することができます。

### 音声認識

この機能は、更新されたGoogle Chromeブラウザでのみ動作します。
入力はメッセージボックスに書き起こされ、停止すると自動的に送信されます。

> **警告**
> 左上のマイクボタンを使用して音声を使用できる機能を実装中です。
> この機能は非常にバグが多く、エラーが発生しやすいので、動作することを期待しないでください！

## TODO

私はこれらを実行しないとわかっているので、ここに置いておきます。追加/改善できることと、私がそれを行わなかった理由：

| 何                          | なぜ                                                                                                  |
|-------------------------------|------------------------------------------------------------------------------------------------------|
| メッセージの意図を増やす          | データをすべて自分で作成するには時間がかかりすぎる                                                    |
| 表情                   | NLPとLive2Dの相互作用方法のため、統合が難しい。nlp.jsの感情分析を使えばできるかも？  |
| より良いWeb UI/UX              | 動作する限り優先度は低い                                                                     |
| プログレッシブWebアプリ（オフライン） | 最低の優先度、誰もオフラインでこれを使いたくないだろう                                           |

## 開発

マシンでこれを実行するには、以下の手順を試してください。

1. リポジトリをクローンする
  ```sh
  git clone https://github.com/sglkc/waifu-otw.git
  cd waifu-otw
  ```
2. パッケージマネージャーを使用して依存関係をインストールする
  ```sh
  npm install
  ```
3. a. ローカルホストで実行する
  ```sh
  npm run dev
  ```
4. b. 本番用にビルドする場合
  ```sh
  npm run build
  ```

## ライセンス

MITライセンスの下で配布されています。詳細は[LICENSE](LICENSE)をご覧ください。
