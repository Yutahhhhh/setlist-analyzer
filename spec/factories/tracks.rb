# frozen_string_literal: true

FactoryBot.define do
  sequence(:unique_id) { |n| n }
  factory :track do
    association :user
    name { "MyMusic#{rand(1000)}" }
    title { "Track #{rand(1000)}" }
    artist { "Artist #{rand(100)}" }
    album { "Album #{rand(100)}" }
    year { rand(1990..2020) }
    genre { "Genre #{rand(10)}" }
    path { "#{file_prefix}_#{generate(:unique_id)}.#{extension}" }
    audio_mime_type { AudioUtil::EXTENSION_TO_MIME_TYPE_MAP[File.extname(path)] }
    duration { rand(200..300) }

    trait :with_cover_image do
      cover_image { Rack::Test::UploadedFile.new(Rails.root.join('fixtures/test.png').to_s) }
      cover_mime_type { 'image/png' }
    end

    transient do
      file_prefix { 'file' }
      extension { 'mp3' }
    end
  end
end
