# frozen_string_literal: true

module Api::Tracks::Job
  extend ActiveSupport::Concern

  private

  def schedule_audio_analyze_job(files, is_all_tracks)
    job_status = JobStatus::AudioAnalyze.new(user_id: current_user.id)
    job_status.target = files
    job_status.prepare!
    AudioAnalyzeJob.perform_async(files, job_status.id, is_all_tracks)
    job_status
  end

  def schedule_audio_analyze_lyric_job(tracks)
    job_status = JobStatus::AudioAnalyzeLyric.new(user_id: current_user.id)
    job_status.target = tracks.ids
    job_status.prepare!
    AudioAnalyzeLyricJob.perform_async(tracks.pluck(:path), job_status.id)
    job_status
  end

  def schedule_genre_analyze_job(tracks)
    job_status = JobStatus::AudioAnalyzeGenre.new(user_id: current_user.id)
    job_status.target = tracks.ids
    job_status.prepare!
    AudioAnalyzeGenreJob.perform_async(tracks.pluck(:path), job_status.id)
    job_status
  end
end
