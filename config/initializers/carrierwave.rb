# frozen_string_literal: true

CarrierWave.configure do |config|
  if Rails.env.test? || Rails.env.development?
    config.enable_processing = false
    config.asset_host = 'http://localhost:7300'
  end

  config.storage = :file
  config.cache_storage = :file
end
