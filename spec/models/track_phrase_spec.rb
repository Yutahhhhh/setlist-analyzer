# frozen_string_literal: true

require 'rails_helper'

RSpec.describe TrackPhrase, type: :model do
  subject(:track_phrase) { build(:track_phrase) }

  describe 'factory' do
    it '有効なファクトリが存在すること' do
      expect(build(:track_phrase)).to be_valid
    end
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:phrase) }
    it { is_expected.to validate_numericality_of(:start_time).is_greater_than_or_equal_to(0) }

    it 'start_timeがend_timeよりも小さい場合は有効であること' do
      track_phrase.end_time = track_phrase.start_time - 1
      expect(track_phrase).not_to be_valid
    end
  end

  describe 'associations' do
    it { is_expected.to belong_to(:track) }
  end
end
