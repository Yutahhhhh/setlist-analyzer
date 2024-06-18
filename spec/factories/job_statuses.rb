# frozen_string_literal: true

FactoryBot.define do
  factory :job_status do
    association :user
    job_id { SecureRandom.uuid }
    job_type { JobStatus.job_types.keys.sample }
    status { JobStatus.statuses[:running] }
    message { 'Processing...' }
    progress { 0 }
    result { nil }
    retry_count { 0 }
    started_at { Time.current }
    finished_at { nil }
  end

  factory :audio_analyze_job_status, parent: :job_status, class: 'JobStatus::AudioAnalyze' do
    job_type { :audio_analyze }
    message { 'Analyzing in progress...' }
  end

  factory :audio_genre_train_job_status, parent: :job_status, class: 'JobStatus::AudioGenreTrain' do
    job_type { :audio_genre_train }
    message { 'Training in progress...' }
  end

  factory :audio_analyze_lyric_job_status, parent: :job_status, class: 'JobStatus::AudioAnalyzeLyric' do
    job_type { :audio_analyze_lyric }
    message { 'Lyric Analyzing in progress...' }
  end
end
