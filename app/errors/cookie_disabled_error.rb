# frozen_string_literal: true

class CookieDisabledError < StandardError
  attr_reader :error_code

  def initialize(msg = 'Cookies are disabled. Please enable cookies to continue.')
    super
    @error_code = 'COOKIE_DISABLED'
  end
end
