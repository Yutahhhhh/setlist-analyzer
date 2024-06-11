# frozen_string_literal: true

module Api
  class UsersController < Api::ApplicationController
    prepend_after_action :set_auth_header, only: [:current]

    def current
      render json: UserBlueprint.render(current_user)
    end

    private

    def set_auth_header
      client = request.headers['client']
      return if client.blank?

      new_auth_header = current_user.create_new_auth_token(client)
      new_auth_header.each do |name, value|
        response.headers[name] = value
      end
    end
  end
end
