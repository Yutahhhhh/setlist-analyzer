# frozen_string_literal: true

FactoryBot.define do
  factory :setlist_track do
    sequence(:play_order) { |n| n }
    association :setlist
    association :track
  end
end
