# frozen_string_literal: true

module Api
  class ApplicationController < ::ApplicationController
    before_action :authenticate_api_user!

    alias current_user current_api_user

    def render_authenticate_error
      message = I18n.t('devise.failure.unauthenticated')
      render json: { message:, status: 401 }, status: :unauthorized
    end
  end
end
