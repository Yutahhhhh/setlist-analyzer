# frozen_string_literal: true

class AudioAnalyzeGenreJob < AudioCableBaseJob
  FILES_PER_BATCH = 50
  CHANNEL_PREFIX = 'audio_analyze_genre_channel'

  def perform(audio_files, job_status_id)
    perform_job(audio_files, job_status_id)
  end

  def job_process(files, job_status, _batch_index)
    results = WorkerGenreService.start_predict(files, job_status.user_id)
    process_results(results)
  end

  def process_results(results)
    updates = results.map { |result| { id: result[:id], genre: result[:genre] } }
    Track.update(updates.map { |update| update[:id] }, updates)
  end

  def find_job_status(job_status_id)
    JobStatus::AudioAnalyzeGenre.find(job_status_id)
  end
end
