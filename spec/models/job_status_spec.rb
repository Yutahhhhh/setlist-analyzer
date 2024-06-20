# frozen_string_literal: true

require 'rails_helper'

RSpec.describe JobStatus, type: :model do
  subject(:job_status) { build(:job_status, user:) }

  let(:user) { create(:user) }

  describe 'factory' do
    it '有効なファクトリが存在すること' do
      expect(build(:job_status, user:)).to be_valid
    end
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:job_id) }
    it { is_expected.to validate_uniqueness_of(:job_id).ignoring_case_sensitivity }
  end

  describe 'enums' do
    it { is_expected.to define_enum_for(:status).with_values(running: 0, completed: 1, failed: 2) }

    it {
      expect(job_status).to define_enum_for(:job_type).with_values(
        not_specified: 0, audio_genre_train: 10, audio_analyze: 20, audio_analyze_lyric: 30
      )
    }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:user) }
  end
end
