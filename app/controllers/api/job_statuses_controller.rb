# frozen_string_literal: true

module Api
  class JobStatusesController < Api::ApplicationController
    def index
      render json: JobStatusBlueprint.render(
        current_user.job_statuses.order(created_at: :desc),
        view: :with_train_data
      )
    end
  end
end
