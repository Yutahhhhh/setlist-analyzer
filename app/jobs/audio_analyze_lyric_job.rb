# frozen_string_literal: true

class AudioAnalyzeLyricJob < AudioCableBaseJob
  # 1件の処理が長いので1ファイルずつ処理する
  FILES_PER_BATCH = 1
  CHANNEL_PREFIX = 'audio_analyze_lyric_channel'

  def perform(audio_files, job_status_id)
    perform_job(audio_files, job_status_id)
  end

  def job_process(files, job_status)
    @track = Track.find_by(path: files.first, user_id: job_status.user_id)
    raise ArgumentError, 'Track not found' if @track.nil? || !@track.valid_path?

    phrases, lyrics = WorkerAnalyzeLyricService.start_analyze(@track.path)
    ActiveRecord::Base.transaction do
      @track.track_phrases.destroy_all
      process_results(phrases, lyrics)
    end
  end

  def find_job_status(job_status_id)
    JobStatus::AudioAnalyzeLyric.find(job_status_id)
  end

  private

  def process_results(phrases, lyrics)
    puts "@@@@@@@ phrases: #{phrases}, lyrics: #{lyrics}"
    @track.track_phrases_attributes = phrases.map do |phrase|
      {
        start_time: phrase[:start_time],
        end_time: phrase[:end_time],
        phrase: phrase[:phrase]
      }
    end
    @track.lyrics = lyrics
    @track.save!
  end
end
