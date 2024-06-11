# frozen_string_literal: true

class ErrorsController < ::ApplicationController
  rescue_from Exception,                                    with: :internal_server_error
  rescue_from WorkerServiceError,                           with: :service_unavailable
  rescue_from CookieDisabledError,                          with: :handle_cookie_disabled
  rescue_from ActiveRecord::RecordNotFound,                 with: :not_found
  rescue_from ActiveRecord::RecordInvalid,                  with: :internal_server_error
  rescue_from ActionController::RoutingError,               with: :not_found
  rescue_from ActionController::InvalidAuthenticityToken,   with: :unprocessable_entity

  def show
    raise request.env['action_dispatch.exception']
  end

  def log_error(error, status)
    logger.error "Rendering #{status} - Exception: #{error.message}"
    logger.error error.backtrace.join("\n") if error
  end

  def render_error(status, message)
    render json: { message:, status: }, status:
  end

  def handle_cookie_disabled(exception)
    render json: { error: exception.message, code: exception.error_code }, status: :forbidden
  end

  # 404
  def not_found(error = nil)
    log_error(error, 404)
    render_error(404, '対象のデータが見つかりません。')
  end

  # 422
  def unprocessable_entity(error = nil)
    log_error(error, 422)
    render_error(422, 'エラーが発生しました。入力内容を確認してください。')
  end

  # 500
  def internal_server_error(error = nil)
    log_error(error, 500)
    render_error(500, 'エラーが発生しました。しばらくしてから再度お試しください。')
  end

  # 503
  def service_unavailable(error = nil)
    log_error(error, 503)
    render_error(503, 'サービス利用不可：内部APIでエラーが発生しました。')
  end
end
