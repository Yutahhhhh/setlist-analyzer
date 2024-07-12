# frozen_string_literal: true

require 'blueprinter'

class SetlistBlueprint < Blueprinter::Base
  view :show do
    identifier :id
    fields :name, :genre_name, :created_at, :updated_at
    association :tracks, blueprint: TrackBlueprint, view: :show
  end

  view :list do
    field :setlists do |v, _options|
      v[:setlists].map do |setlist|
        SetlistBlueprint.render_as_hash(setlist, view: :show)
      end
    end
  end
end
