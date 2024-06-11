# frozen_string_literal: true

class WorkerService
  include HTTParty
  base_uri Rails.application.config.worker_url
end
