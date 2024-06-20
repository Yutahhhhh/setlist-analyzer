# frozen_string_literal: true

class AudioAnalyzeLyricChannel < ApplicationCable::Channel
  def subscribed
    stream_from channel_id

    # 接続時に最新を送信
    job_status = find_job(params[:job_id])
    transmit_current_status(job_status)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  private

  def channel_id
    "audio_analyze_lyric_channel_#{params[:job_id]}"
  end

  def find_job(job_id)
    JobStatus::AudioAnalyzeLyric.find_by(job_id:)
  end

  def transmit_current_status(job_status)
    AudioAnalyzeLyricChannel.broadcast_to(channel_id, ::JobStatusBlueprint.render(job_status))
  end
end
