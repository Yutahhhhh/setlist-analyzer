# frozen_string_literal: true

Rails.application.configure do
  config.exceptions_app = ->(env) { ErrorsController.action(:show).call(env) }
end
