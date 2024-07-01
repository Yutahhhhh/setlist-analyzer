# Setlist Analyzer

## プロジェクト概要
普段DJで使用しているローカルの音楽ファイルを解析したり、セットリストを自動生成したりする

## 前提条件
- Docker: Dockerを使用して環境が構築されています。

## 利用技術
- **Backend:** Rails, Flask
- **Frontend:** Next.js
- **データストア:** Redis
- **その他のライブラリおよびツール:** 
  - Flask: flask-cors, librosa, numpy, mutagen, tensorflow
  - Python: pylint, autopep8, black, isort, pytest
  - Ruby/Rails: 詳細なGemリストは上記の `Gemfile` を参照してください。

## ローカル開発環境のセットアップ

1. クローンする

```
git clone https://github.com/Yutahhhhh/setlist-analyzer.git
```

2. 初回起動のみ

```sh
docker-compose up --build
```

workers（flask）はとてつもなく処理が重いため、ホストマシン上での立ち上げを推奨。
※ docker-compose.ymlのworkerをコメントアウト
```
cd workers
python3 -m venv venv
source venv/bin/activate
./venv/bin/python -m flask run --host=0.0.0.0 --port=5328 --debugger --reload
```

3. 環境変数の設定

.env.template をコピーして .env ファイルを作成し、解析対象の（オーディオファイルが含まれる）ディレクトリを指定
※ 許可されている拡張子は ".mp3", ".wav", ".flac", ".ogg"

```
# env.template

AUDIO_PATH=/Users/xxx/music/
WORKER_URL=http://host.docker.internal:5328 # ホストマシン上で立ち上げる場合
REDIS_URL=redis://redis:6379/0
```

## CMD

### 静的解析

- コードフォーマット: `./devtools/run_all_format`
- 単体テスト: `./devtools/run_all_test`

※ テスト実行は全てdocker上で起動している必要がある

