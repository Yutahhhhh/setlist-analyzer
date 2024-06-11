# frozen_string_literal: true

require 'rails_helper'

RSpec.describe JobStatus::AudioAnalyze, type: :model do
  let(:user) { create(:user) }
  let(:job_status) { create(:audio_analyze_job_status, user:) }

  describe '#prepare!' do
    before { job_status.prepare! }

    it '実行中の状態に更新されていること' do
      expect(job_status.status).to eq('running')
      expect(job_status.job_id).not_to be_nil
      expect(job_status.started_at).not_to be_nil
      expect(job_status.message).to eq('Analyzing in progress...')
    end
  end

  describe '#finish!' do
    before do
      job_status.prepare!
      job_status.finish!
    end

    it '完了の状態に更新されていること' do
      expect(job_status.status).to eq('completed')
      expect(job_status.progress).to eq(100)
      expect(job_status.message).to eq('Analyzing completed successfully')
      expect(job_status.finished_at).not_to be_nil
    end
  end

  context 'when validation' do
    it 'デフォルトでaudio_analyzeが設定されていること' do
      expect(job_status.job_type).to eq('audio_analyze')
    end
  end
end
