# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  subject(:user) { build(:user) }

  describe 'factory' do
    it '有効なFactoryが存在すること' do
      expect(build(:user)).to be_valid
    end
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:password) }
    it { is_expected.to validate_uniqueness_of(:email).scoped_to(:provider).ignoring_case_sensitivity }
  end

  describe 'associations' do
    it { is_expected.to have_many(:tracks) }
    it { is_expected.to have_many(:job_statuses) }
  end
end
