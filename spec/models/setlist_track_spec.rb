# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SetlistTrack, type: :model do
  subject(:setlist_track) { build(:setlist_track) }

  describe 'factory' do
    it '有効なファクトリが存在すること' do
      expect(build(:setlist_track)).to be_valid
    end
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:play_order) }
    it { is_expected.to validate_numericality_of(:play_order).only_integer }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:setlist) }
    it { is_expected.to belong_to(:track) }
  end
end
