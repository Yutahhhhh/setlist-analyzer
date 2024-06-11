# frozen_string_literal: true

class AudioGenreTrainChannel < ApplicationCable::Channel
  def subscribed
    stream_from "audio_genre_train_channel_#{params[:job_id]}"

    # 接続時に最新を送信
    job_status = find_job(params[:job_id])
    transmit_current_status(job_status)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  private

  def channel_id
    "audio_genre_train_channel_#{params[:job_id]}"
  end

  def find_job(_job_id)
    JobStatus::AudioGenreTrain.find_by(job_id: params[:job_id])
  end

  def transmit_current_status(job_status)
    AudioGenreTrainChannel.broadcast_to(channel_id, ::AudioGenreTrainJobStatusBlueprint.render(job_status))
  end
end
