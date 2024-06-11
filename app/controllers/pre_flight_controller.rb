# frozen_string_literal: true

class PreFlightController < ::ApplicationController
  def handle_pre_flight
    head :ok
  end
end
