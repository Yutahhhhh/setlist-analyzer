# frozen_string_literal: true

class Api::Auth::SessionsController < DeviseTokenAuth::SessionsController
  include Auth::TokenSynchronization

  def create
    raise CookieDisabledError unless cookies[:auth_token]

    auto_signin
  end

  # FIXME: ログイン画面を作ったら変える（もし公開したら）
  def auto_signin
    @resource = User.first
    @token = @resource.create_token
    @resource.save
    sign_in(:user, @resource)

    render json: UserBlueprint.render(@resource)
  end
end
