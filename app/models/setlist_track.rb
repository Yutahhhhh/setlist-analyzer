# frozen_string_literal: true

# == Schema Information
#
# Table name: setlist_tracks
#
#  id                                                       :bigint           not null, primary key
#  play_order(再生する順番)                                 :integer          not null
#  created_at                                               :datetime         not null
#  updated_at                                               :datetime         not null
#  setlist_id(セットリストID（setlistsテーブルの外部キー）) :integer          not null
#  track_id(トラックID（tracksテーブルの外部キー）)         :integer          not null
#  user_id(所持しているユーザーID)                          :bigint
#
# Indexes
#
#  index_setlist_tracks_on_track_id_and_setlist_id_and_user_id  (track_id,setlist_id,user_id)
#
class SetlistTrack < ApplicationRecord
  belongs_to :setlist
  belongs_to :track

  validates :play_order, presence: true, numericality: { only_integer: true }
end
