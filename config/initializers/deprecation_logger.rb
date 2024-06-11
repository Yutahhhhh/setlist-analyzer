# frozen_string_literal: true

ActiveSupport::Deprecation.behavior = :log
ActiveSupport::Deprecation.behavior = lambda do |message, callstack|
  Rails.logger.warn message
  Rails.logger.warn callstack.join("\n")
end
