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
  has_many :setlist_tracks, dependent: :destroy
  has_many :setlists, through: :setlist_tracks
  has_many :prev_transitions, class_name: 'TrackTransition', foreign_key: 'prev_track_id', dependent: :destroy,
                              inverse_of: :prev_track
  has_many :next_transitions, class_name: 'TrackTransition', foreign_key: 'next_track_id', dependent: :destroy,
                              inverse_of: :next_track
  has_many :track_phrases, dependent: :destroy
  belongs_to :user

  accepts_nested_attributes_for :track_phrases, allow_destroy: true

  mount_base64_uploader :cover_image, TrackUploader

  validates :name, :path, presence: true
  validates :path, uniqueness: { case_sensitive: false }

  validates :audio_mime_type, inclusion: { in: AudioUtil::EXTENSION_TO_MIME_TYPE_MAP.values }
  validates :tempo, :key, :mode, :time_signature, :acousticness, :energy, :spectral_flatness, :loudness, :valence,
            :duration, numericality: true, allow_nil: true

  scope :by_filename, lambda { |filename|
    where('path LIKE ?', "%#{filename}%") if filename.present?
  }

  scope :by_mime_types, lambda { |mime_types|
    where(audio_mime_type: mime_types) if mime_types.any?
  }

  scope :by_genres, lambda { |genres|
    where(genre: genres) if genres.any?
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

  def self.search(filename:, mime_types:, genres:, has_lyric_track:)
    s = all
    s = s.by_filename(filename)
    s = s.by_mime_types(mime_types)
    s = s.by_genres(genres)
    s.has_lyrics(has_lyric_track)
  end
end
