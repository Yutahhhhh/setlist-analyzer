# frozen_string_literal: true

require 'oj'

Blueprinter.configure do |config|
  config.generator = Oj # default is JSON
  config.datetime_format = '%Y-%m-%dT%H:%M:%S%:z' # RFC3339
end
