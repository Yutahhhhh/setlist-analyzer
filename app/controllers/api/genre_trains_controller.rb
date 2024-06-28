# frozen_string_literal: true

module Api
  class GenreTrainsController < Api::ApplicationController
    def create
      target_files = current_user.tracks.where.not(genre: nil).pluck(:path)
      job_status = schedule_genre_train_job(target_files)
      render json: JobStatusBlueprint.render(job_status, view: :with_train_data), status: :ok
    end

    private

    def schedule_genre_train_job(files)
      job_status = JobStatus::AudioGenreTrain.new(user_id: current_user.id)
      job_status.prepare!
      AudioGenreTrainJob.perform_async(files, job_status.id)
      job_status
    end
  end
end
