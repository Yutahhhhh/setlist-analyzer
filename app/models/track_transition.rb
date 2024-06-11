# frozen_string_literal: true

# == Schema Information
#
# Table name: track_transitions
#
#  id                                                                          :bigint           not null, primary key
#  transition_time(切り替えタイミングの秒数)                                   :integer          not null
#  transition_type(切り替え方法（文字で表記）)                                 :string(255)      not null
#  created_at                                                                  :datetime         not null
#  updated_at                                                                  :datetime         not null
#  next_track_id(次のセットリストの楽曲ID（setlist_tracksテーブルの外部キー）) :integer          not null
#  prev_track_id(前のセットリストの楽曲ID（setlist_tracksテーブルの外部キー）) :integer          not null
#  user_id(ユーザーID)                                                         :bigint
#
# Indexes
#
#  idx_on_prev_track_id_next_track_id_user_id_d0ab34b927  (prev_track_id,next_track_id,user_id)
#
class TrackTransition < ApplicationRecord
  belongs_to :prev_track, class_name: 'Track'
  belongs_to :next_track, class_name: 'Track'

  validates :transition_time, presence: true, numericality: { only_integer: true }
  validates :transition_type, presence: true
end
