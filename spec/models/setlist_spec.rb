# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Setlist, type: :model do
  subject(:setlist) { build(:setlist) }

  describe 'factory' do
    it '有効なファクトリが存在すること' do
      expect(build(:setlist)).to be_valid
    end
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_numericality_of(:rating).is_greater_than_or_equal_to(1).is_less_than_or_equal_to(5) }
  end

  describe 'associations' do
    it { is_expected.to have_many(:setlist_tracks).dependent(:delete_all) }
    it { is_expected.to have_many(:tracks).through(:setlist_tracks) }
  end
end
