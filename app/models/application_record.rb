# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def error_messages
    errors.messages.each_with_object({}) do |(key, messages), msgs|
      msgs[key] = messages
    end
  end
end
