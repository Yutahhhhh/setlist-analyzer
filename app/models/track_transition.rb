# frozen_string_literal: true

# == Schema Information
#
# Table name: track_transitions
#
#  id                                          :bigint           not null, primary key
#  transition_time(切り替えタイミングの秒数)   :integer          not null
#  transition_type(切り替え方法（文字で表記）) :string(255)      not null
#  created_at                                  :datetime         not null
#  updated_at                                  :datetime         not null
#  setlist_track_id(対象のセットリストの楽曲)  :bigint           not null
#  user_id(ユーザーID)                         :bigint
#
# Indexes
#
#  index_track_transitions_on_setlist_track_id_and_user_id  (setlist_track_id,user_id)
#
class TrackTransition < ApplicationRecord
  belongs_to :setlist_track
  belongs_to :user

  validates :transition_time, presence: true, numericality: { only_integer: true }
  validates :transition_type, presence: true
end
