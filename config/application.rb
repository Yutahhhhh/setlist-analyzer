# frozen_string_literal: true

require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module App
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.1

    # Don't generate system test files.
    config.generators.system_tests = nil

    # Timezone
    config.time_zone = 'Tokyo'
    config.active_record.default_timezone = :local

    # i18n
    config.i18n.load_path += Dir[Rails.root.join('config/locales/**/*.{rb,yml}')]
    config.i18n.default_locale = :ja
    # config.i18n.available_locales = %i[en ja]

    excluded_routes = ->(env) { !env['PATH_INFO'].match(%r{^/api}) || env['PATH_INFO'].match(%r{/join}) }
    config.middleware.use OliveBranch::Middleware,
                          inflection: 'camel',
                          exclude_params: excluded_routes,
                          exclude_response: excluded_routes,
                          content_type_check: ->(_content_type) { true }

    config.active_job.queue_adapter = :sidekiq

    config.action_dispatch.rescue_responses.update(
      'WorkerServiceError' => :service_unavailable,
      'CookieDisabledError' => :forbidden
    )
  end
end
