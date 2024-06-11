# frozen_string_literal: true

class AudioGenreTrainJob < AudioCableBaseJob
  FILES_PER_BATCH = 30
  CHANNEL_PREFIX = 'audio_genre_train_channel'

  def perform(audio_files, job_status_id)
    perform_job(audio_files, job_status_id)
  end

  def job_process(files, user_id)
    WorkerGenreService.start_train(files, user_id)
  end

  def find_job_status(job_status_id)
    JobStatus::AudioGenreTrain.find(job_status_id)
  end
end
