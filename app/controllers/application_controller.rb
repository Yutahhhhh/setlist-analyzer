# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include DeviseTokenAuth::Concerns::SetUserByToken
  include ActionController::Cookies
  before_action :restore_session
  protect_from_forgery with: :null_session
  skip_forgery_protection

  def render_validation_error(resource = nil)
    json = { status: 400, message: '入力エラーです。' }
    json[:error_messages] = resource.error_messages if resource
    render json:, status: :bad_request
  end

  private

  def restore_session
    return if cookies['access-token'].nil?

    token_data = Base64.urlsafe_decode64(cookies['access-token'])
    token_hash = JSON.parse(token_data)
    request.headers.merge!(token_hash.slice('access-token', 'client', 'uid'))
  end
end
