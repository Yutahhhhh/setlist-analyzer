# frozen_string_literal: true

FactoryBot.define do
  factory :setlist do
    association :user
    name { 'My Awesome Setlist' }
    genre_name { 'Rock' }
    rating { 3 }

    trait :with_tracks do
      after(:create) do |setlist, _evaluator|
        3.times do |i|
          track = create(:track, user: setlist.user, genre: setlist.genre_name)
          create(:setlist_track, setlist:, play_order: i + 1, track:)
        end
      end
    end
  end
end
