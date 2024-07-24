# frozen_string_literal: true

# == Schema Information
#
# Table name: tracks
#
#  id                                                                                                                          :bigint           not null, primary key
#  acousticness(曲がアコースティックである確率（0.0〜1.0、0は非アコースティック、1は完全にアコースティック）)                  :float(24)
#  album(アルバム)                                                                                                             :string(255)
#  artist(アーティスト)                                                                                                        :string(255)
#  audio_mime_type(オーディオ拡張子)                                                                                           :string(255)
#  cover_image(アートワーク)                                                                                                   :string(255)
#  cover_mime_type(サムネ拡張子)                                                                                               :string(255)
#  duration(再生時間（秒、曲の長さを秒単位で示す）)                                                                            :float(24)
#  energy(曲がエネルギッシュである程度（0.0〜1.0、高い値はエネルギーが高いことを示す）)                                        :float(24)
#  genre(曲のジャンル)                                                                                                         :string(255)
#  key(曲の全体的なキー（音階）を示す整数（ピッチクラス表記法、0から11まで）)                                                  :integer
#  loudness(曲の全体的な音の大きさ（デシベル、一般的に-60 dBから0 dBの範囲）)                                                  :float(24)
#  lyrics(歌詞)                                                                                                                :text(65535)
#  md5(MD5)                                                                                                                    :string(255)
#  measure(小節数（曲の構造に基づく整数値）)                                                                                   :integer
#  mfcc(音声のティンバーやテクスチャーを特徴づけるために使われる係数（一般的に-20から20の範囲）)                               :float(24)
#  mode(曲のモード（1:メジャー、0:マイナー、1は明るい感じ、0は暗い感じを示す）)                                                :integer
#  name(名前)                                                                                                                  :string(255)      not null
#  path(音楽ファイルのパス)                                                                                                    :string(255)      not null
#  spectral_bandwidth(スペクトル帯域幅（Hz単位、一般的に数百Hzから数千Hzの範囲）)                                              :float(24)
#  spectral_contrast(スペクトルコントラスト（dB単位で測定、0から40 dB程度、高い値は周波数帯域のコントラストが高いことを示す）) :float(24)
#  spectral_flatness(スペクトルフラットネス（0.0〜1.0、1に近いほどノイズに近い）)                                              :float(24)
#  tempo(曲の全体的な推定テンポ（BPM、通常30〜250 BPMの範囲）)                                                                 :float(24)
#  time_signature(曲の拍子記号（1小節あたりの拍数、一般的に2, 3, 4, 6など）)                                                   :integer
#  title(タイトル)                                                                                                             :string(255)
#  valence(曲が陽性の感情を伝える確率（0.0〜1.0、高い値はポジティブな感情を示す）)                                             :float(24)
#  year(リリース年)                                                                                                            :string(255)
#  created_at                                                                                                                  :datetime         not null
#  updated_at                                                                                                                  :datetime         not null
#  user_id(所持しているユーザーID)                                                                                             :bigint
#
# Indexes
#
#  index_tracks_on_path     (path) UNIQUE
#  index_tracks_on_user_id  (user_id)
#
class Track < ApplicationRecord
  has_many :setlist_tracks, dependent: :delete_all
  has_many :setlists, through: :setlist_tracks
  has_many :track_phrases, dependent: :delete_all
  belongs_to :user

  accepts_nested_attributes_for :track_phrases, allow_destroy: true

  mount_base64_uploader :cover_image, TrackUploader

  validates :name, :path, presence: true
  validates :path, uniqueness: { case_sensitive: false }

  validates :audio_mime_type, inclusion: { in: AudioUtil::EXTENSION_TO_MIME_TYPE_MAP.values }
  validates :tempo, :key, :mode, :time_signature, :acousticness, :energy, :spectral_flatness, :loudness, :valence,
            :duration, numericality: true, allow_nil: true

  RECOMMEND_ATTRIBUTES = {
    tempo: 'tempo',
    key: '`key`',
    mode: 'mode',
    valence: 'valence',
    time_signature: 'time_signature',
    energy: 'energy',
    acousticness: 'acousticness',
    spectral_flatness: 'spectral_flatness',
    loudness: 'loudness'
  }.freeze

  scope :with_filename, lambda { |filename|
    where('path LIKE ?', "%#{filename}%") if filename.present?
  }

  scope :by_paths, lambda { |paths|
    where(path: paths) if paths.any?
  }

  scope :by_mime_types, lambda { |audio_mime_type|
    where(audio_mime_type:) if audio_mime_type.any?
  }

  scope :by_genres, lambda { |genres|
    where(genre: genres) if genres.any?
  }

  scope :by_tempo_range, lambda { |tempo_range|
    where(tempo: tempo_range[0]..tempo_range[1]) if tempo_range.present? && tempo_range.size == 2
  }

  scope :has_lyrics, lambda { |has_lyric_track|
    where(lyrics: nil) unless has_lyric_track
  }

  def cover_image_url
    cover_image.url if cover_image.present?
  end

  def fetch(path)
    return if path.blank?

    self.path = path
    self.name = File.basename(path)
    self
  end

  def valid_path?
    File.exist?(path)
  end

  def self.search(options = {})
    s = where.not(id: options[:exclude_ids])
    s = s.with_filename(options[:filename])
    s = s.by_mime_types(options[:mime_types])
    s = s.by_genres(options[:genres])
    s = s.by_tempo_range(options[:tempo_range])
    s.has_lyrics(options[:has_lyric_track])
  end

  def self.uniq_genre_ids
    where.not(genre: nil).group(:genre).pluck('MIN(id)')
  end

  def recommendations(weights, phrase)
    ex_all = Track.where.not(id:).includes(:track_phrases).references(:track_phrases)

    # フレーズを含むトラックで絞り込む
    if phrase.present?
      ex_all = ex_all
               .where('track_phrases.phrase LIKE ?', "%#{phrase}%")
    end

    orders = []

    # 各属性に対して、それぞれのウェイトを適用して、その差の絶対値を計算
    RECOMMEND_ATTRIBUTES.except(:genre).each do |attribute, column_name|
      value = send(attribute)
      next unless value.present? && weights[attribute]

      quoted_value = ActiveRecord::Base.connection.quote(value)
      weight = weights[attribute]
      orders << "#{weight} * ABS(#{column_name} - #{quoted_value})"
    end

    # ジャンルは文字列なので別途処理
    if weights[:genre]
      quoted_genre = ActiveRecord::Base.connection.quote(genre)
      genre_weight = weights[:genre]
      orders << "CASE WHEN genre = #{quoted_genre} THEN 0 ELSE #{genre_weight} END"
    end

    ex_all.order(Arel.sql(orders.join(', '))).limit(100)
  end
end
