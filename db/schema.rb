# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 0) do
  create_table "job_statuses", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "JOBの実行状況を追跡するためのテーブル", force: :cascade do |t|
    t.bigint "user_id", comment: "起動したユーザーのID"
    t.string "job_id", null: false, comment: "一意の識別子"
    t.integer "job_type", default: 10, null: false, comment: "0: 指定なし, 10: 音楽ジャンル, 20: 音楽解析, 30: 歌詞解析"
    t.integer "status", default: 0, null: false, comment: "0: 実行中, 1: 完了, 2: 失敗"
    t.integer "progress", default: 0, null: false, comment: "進捗"
    t.text "message", comment: "メッセージ（エラーメッセージや進捗など）"
    t.datetime "started_at", comment: "開始時刻"
    t.datetime "finished_at", comment: "終了時刻"
    t.text "result", comment: "結果や出力内容"
    t.integer "retry_count", default: 0, comment: "再試行回数"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["job_id"], name: "index_job_statuses_on_job_id", unique: true
    t.index ["user_id"], name: "index_job_statuses_on_user_id"
  end

  create_table "setlist_tracks", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "セットリストと楽曲の関連を保持するテーブル", force: :cascade do |t|
    t.bigint "user_id", comment: "所持しているユーザーID"
    t.integer "track_id", null: false, comment: "トラックID（tracksテーブルの外部キー）"
    t.integer "setlist_id", null: false, comment: "セットリストID（setlistsテーブルの外部キー）"
    t.integer "play_order", null: false, comment: "再生する順番"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["track_id", "setlist_id", "user_id"], name: "index_setlist_tracks_on_track_id_and_setlist_id_and_user_id"
  end

  create_table "setlists", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "セットリストの基本情報を保持するテーブル", force: :cascade do |t|
    t.bigint "user_id", comment: "所持しているユーザーID"
    t.string "name", null: false, comment: "名前"
    t.string "genre_name", null: false, comment: "ジャンル名"
    t.integer "rating", null: false, comment: "評価（1〜5）"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_setlists_on_user_id"
  end

  create_table "track_phrases", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "トラックの歌詞から選択されたフレーズとそのタイミング情報を保存するテーブルです", force: :cascade do |t|
    t.string "phrase", null: false, comment: "トラックの歌詞から抽出された具体的なフレーズ"
    t.float "start_time", default: 0.0, null: false, comment: "フレーズが開始する時間（秒単位）"
    t.float "end_time", default: 0.0, null: false, comment: "フレーズが終了する時間（秒単位）。start_timeよりも大きな値である必要があります"
    t.bigint "track_id", null: false, comment: "関連するトラックのID"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["track_id"], name: "index_track_phrases_on_track_id"
  end

  create_table "track_transitions", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "楽曲の切り替えタイミングを保持するテーブル", force: :cascade do |t|
    t.bigint "user_id", comment: "ユーザーID"
    t.integer "prev_track_id", null: false, comment: "前のセットリストの楽曲ID（setlist_tracksテーブルの外部キー）"
    t.integer "next_track_id", null: false, comment: "次のセットリストの楽曲ID（setlist_tracksテーブルの外部キー）"
    t.integer "transition_time", null: false, comment: "切り替えタイミングの秒数"
    t.string "transition_type", null: false, comment: "切り替え方法（文字で表記）"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["prev_track_id", "next_track_id", "user_id"], name: "idx_on_prev_track_id_next_track_id_user_id_d0ab34b927"
  end

  create_table "tracks", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "解析したトラックの情報を保持するテーブル", force: :cascade do |t|
    t.bigint "user_id", comment: "所持しているユーザーID"
    t.string "title", comment: "タイトル"
    t.string "artist", comment: "アーティスト"
    t.string "album", comment: "アルバム"
    t.string "year", comment: "リリース年"
    t.string "audio_mime_type", comment: "オーディオ拡張子"
    t.string "cover_mime_type", comment: "サムネ拡張子"
    t.string "cover_image", comment: "アートワーク"
    t.string "md5", comment: "MD5"
    t.string "name", null: false, comment: "名前"
    t.string "genre", comment: "曲のジャンル"
    t.float "acousticness", comment: "曲がアコースティックである確率（0.0〜1.0、0は非アコースティック、1は完全にアコースティック）"
    t.float "spectral_contrast", comment: "スペクトルコントラスト（dB単位で測定、0から40 dB程度、高い値は周波数帯域のコントラストが高いことを示す）"
    t.float "energy", comment: "曲がエネルギッシュである程度（0.0〜1.0、高い値はエネルギーが高いことを示す）"
    t.float "spectral_flatness", comment: "スペクトルフラットネス（0.0〜1.0、1に近いほどノイズに近い）"
    t.float "spectral_bandwidth", comment: "スペクトル帯域幅（Hz単位、一般的に数百Hzから数千Hzの範囲）"
    t.float "loudness", comment: "曲の全体的な音の大きさ（デシベル、一般的に-60 dBから0 dBの範囲）"
    t.float "mfcc", comment: "音声のティンバーやテクスチャーを特徴づけるために使われる係数（一般的に-20から20の範囲）"
    t.float "valence", comment: "曲が陽性の感情を伝える確率（0.0〜1.0、高い値はポジティブな感情を示す）"
    t.float "tempo", comment: "曲の全体的な推定テンポ（BPM、通常30〜250 BPMの範囲）"
    t.integer "key", comment: "曲の全体的なキー（音階）を示す整数（ピッチクラス表記法、0から11まで）"
    t.integer "mode", comment: "曲のモード（1:メジャー、0:マイナー、1は明るい感じ、0は暗い感じを示す）"
    t.integer "time_signature", comment: "曲の拍子記号（1小節あたりの拍数、一般的に2, 3, 4, 6など）"
    t.integer "measure", comment: "小節数（曲の構造に基づく整数値）"
    t.string "path", null: false, comment: "音楽ファイルのパス"
    t.text "lyrics", comment: "歌詞"
    t.float "duration", comment: "再生時間（秒、曲の長さを秒単位で示す）"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["path"], name: "index_tracks_on_path", unique: true
    t.index ["user_id"], name: "index_tracks_on_user_id"
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "provider", default: "email", null: false
    t.string "uid", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.boolean "allow_password_change", default: false
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.string "name"
    t.string "nickname"
    t.string "full_name"
    t.string "image"
    t.string "email"
    t.text "tokens"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email", "provider"], name: "index_users_on_email_and_provider", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
  end

  add_foreign_key "track_phrases", "tracks", name: "track_phrases_track_id_fk"
end
