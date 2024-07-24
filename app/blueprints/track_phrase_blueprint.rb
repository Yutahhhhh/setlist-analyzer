# frozen_string_literal: true

require 'blueprinter'

class TrackPhraseBlueprint < Blueprinter::Base
  identifier :id
  fields :phrase, :start_time, :end_time
end
