# frozen_string_literal: true

module Auth::TokenSynchronization
  include ActionController::Cookies
  extend ActiveSupport::Concern
  AUTH_HEADER_KEYS = %w[access-token client uid].freeze

  # rubocop:disable Rails/LexicallyScopedActionFilter
  included do
    prepend_after_action :sync_tokens_with_client, only: [:create]
  end
  # rubocop:enable Rails/LexicallyScopedActionFilter

  private

  def sync_tokens_with_client
    return unless (token = response.headers['access-token'])

    cookies[:auth_token] = cookie_settings(token)
    remove_auth_headers
  end

  def remove_auth_headers
    AUTH_HEADER_KEYS.each { |key| response.headers.delete(key) }
  end

  def cookie_settings(token)
    {
      value: encode_token_data(token),
      httponly: true,
      expires: 30.days.from_now
    }
  end

  def encode_token_data(token)
    auth_data = {
      'access-token' => token,
      'client' => response.headers['client'],
      'uid' => response.headers['uid']
    }
    CGI.escape(Base64.encode64(auth_data.to_json))
  end
end
