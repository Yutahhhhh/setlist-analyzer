# frozen_string_literal: true

# == Schema Information
#
# Table name: setlists
#
#  id                              :bigint           not null, primary key
#  genre_name(ジャンル名)          :string(255)      not null
#  name(名前)                      :string(255)      not null
#  rating(評価（1〜5）)            :integer          not null
#  created_at                      :datetime         not null
#  updated_at                      :datetime         not null
#  user_id(所持しているユーザーID) :bigint
#
# Indexes
#
#  index_setlists_on_user_id  (user_id)
#
class Setlist < ApplicationRecord
  has_many :setlist_tracks, dependent: :destroy
  has_many :tracks, through: :setlist_tracks

  validates :genre_name, :setlist_name, presence: true
  validates :rating, numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }
end
