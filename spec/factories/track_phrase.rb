FactoryBot.define do
  factory :track_phrase do
    association :track
    phrase { "MyString" }

    sequence(:start_time) { |n| n * 10 }
    sequence(:end_time) { |n| (n + 1) * 10 + 5 }
  end
end
