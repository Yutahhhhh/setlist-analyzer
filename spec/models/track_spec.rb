# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Track, type: :model do
  subject(:track) { build(:track) }

  let(:target_audio_file_path) { Rails.root.join('spec/fixtures/sample/test.mp3') }

  describe 'factory' do
    it '有効なファクトリが存在すること' do
      expect(build(:track)).to be_valid
    end
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_presence_of(:path) }
    it { is_expected.to validate_uniqueness_of(:path).ignoring_case_sensitivity }
    it { is_expected.to validate_inclusion_of(:audio_mime_type).in_array(AudioUtil::EXTENSION_TO_MIME_TYPE_MAP.values) }
    it { is_expected.to validate_numericality_of(:tempo).allow_nil }
    it { is_expected.to validate_numericality_of(:duration).allow_nil }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to have_many(:setlist_tracks).dependent(:destroy) }
    it { is_expected.to have_many(:setlists).through(:setlist_tracks) }

    it {
      expect(track).to have_many(:prev_transitions)
        .class_name('TrackTransition')
        .with_foreign_key('prev_track_id')
        .dependent(:destroy)
    }

    it {
      expect(track).to have_many(:next_transitions)
        .class_name('TrackTransition')
        .with_foreign_key('next_track_id')
        .dependent(:destroy)
    }
  end

  describe '#cover_image_url' do
    it 'cover_image_urlが生成されていること' do
      stub_metadata
      track = create(:track, :with_cover_image, path: target_audio_file_path)
      expect(track.cover_image_url).to be_present
    end
  end

  describe '#fetch_metadata' do
    it '各パラメータが設定されていること' do
      stub_metadata
      track = build(:track, path: target_audio_file_path)
      track.fetch_metadata(target_audio_file_path, add_cover: false)
      expect(track.title).to be_present
      expect(track.artist).to be_present
      expect(track.album).to be_present
      expect(track.genre).to be_present
      expect(track.year).to be_present
      expect(track.audio_mime_type).to be_present
      expect(track.cover_mime_type).to be_present
    end
  end

  def stub_metadata
    allow(AudioUtil).to receive(:get_metadata)
      .with(target_audio_file_path)
      .and_return({
                    title: 'Example Title',
                    artist: 'Artist Name',
                    album: 'Album Name',
                    genre: 'Genre',
                    year: '2021',
                    audio_mime_type: 'audio/mpeg',
                    cover_mime_type: 'image/jpeg',
                    cover_image: 'data:image/jpeg;base64,...'
                  })
  end
end
