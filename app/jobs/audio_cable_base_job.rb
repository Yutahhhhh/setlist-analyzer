# frozen_string_literal: true

class AudioCableBaseJob
  include Sidekiq::Worker
  sidekiq_options queue: :long_running, timeout: 1.day, retry: 0
  REQUIRED_CONSTANTS = %i[CHANNEL_PREFIX FILES_PER_BATCH].freeze

  def self.const_missing(name)
    raise NotImplementedError, "This #{self} cannot respond to: #{name}" if REQUIRED_CONSTANTS.include?(name)

    super
  end

  private

  def perform_job(audio_files, job_status_id)
    job_status = find_job_status(job_status_id)
    process_audio_files_in_batches(audio_files, job_status)
  end

  def process_audio_files_in_batches(audio_files, job_status)
    channel_id = "#{self.class::CHANNEL_PREFIX}_#{job_status.job_id}"
    files_per_batch = self.class::FILES_PER_BATCH
    total_batches = (audio_files.count.to_f / files_per_batch).ceil

    audio_files.each_slice(files_per_batch).with_index(1) do |files, batch_index|
      process_batch(files, job_status, batch_index)
      update_job_status(job_status, batch_index, total_batches, channel_id)
    end
    finish_job(job_status, channel_id)
  end

  def process_batch(files, job_status, batch_index)
    job_process(files, job_status, batch_index)
  rescue StandardError => e
    channel_id = "#{self.class::CHANNEL_PREFIX}_#{job_status.job_id}"
    handle_error(job_status, e, channel_id)
  end

  def update_job_status(job_status, batch_index, total_batches, channel_id)
    progress = calculate_progress(batch_index, total_batches)
    job_status.update!(progress:, message: 'in progress...')
    broadcast_status(job_status, channel_id)
    logger.info("進捗: #{progress}%")
  end

  def calculate_progress(batch_index, total_batches)
    ((batch_index.to_f / total_batches) * 100).round
  end

  def finish_job(job_status, channel_id)
    job_status.finish!
    broadcast_status(job_status, channel_id)
    logger.info("ジョブ完了: #{job_status.job_id}")
  rescue StandardError => e
    handle_error(job_status, e, channel_id)
  end

  def find_job_status(job_status_id)
    raise NotImplementedError, "This #{self.class} cannot respond to:"
  end

  def handle_error(job_status, error, channel_id)
    job_status.update!(status: :failed, message: "Failed: #{error.message}")
    logger.error("ジョブ失敗: #{job_status.job_id}, エラー: #{error}")
    broadcast_status(job_status, channel_id)
    raise error
  end

  def broadcast_status(job_status, channel_id)
    status_hash = ::JobStatusBlueprint.render_as_hash(job_status)
    camelized_status = lower_camel_key_hash(status_hash)
    ActionCable.server.broadcast(channel_id, camelized_status)
  end

  def lower_camel_key_hash(hash)
    hash.each_with_object({}) do |(k, v), new_hash|
      lower_key = k.to_s.camelize(:lower)
      new_hash[lower_key] = v.is_a?(Hash) ? lower_camel_key_hash(v) : v
    end
  end
end
