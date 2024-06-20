# frozen_string_literal: true

# == Schema Information
#
# Table name: track_phrases
#
#  id                                                                                       :bigint           not null, primary key
#  end_time(フレーズが終了する時間（秒単位）。start_timeよりも大きな値である必要があります) :float(24)        not null
#  phrase(トラックの歌詞から抽出された具体的なフレーズ)                                     :string(255)      not null
#  start_time(フレーズが開始する時間（秒単位）)                                             :float(24)        not null
#  created_at                                                                               :datetime         not null
#  updated_at                                                                               :datetime         not null
#  track_id(関連するトラックのID)                                                           :bigint           not null
#
# Indexes
#
#  index_track_phrases_on_track_id  (track_id)
#
# Foreign Keys
#
#  track_phrases_track_id_fk  (track_id => tracks.id)
#
class TrackPhrase < ApplicationRecord
  belongs_to :track

  validates :phrase, presence: true
  validates :start_time, numericality: { greater_than_or_equal_to: 0 }
  validates :end_time, numericality: { greater_than: :start_time }
end
