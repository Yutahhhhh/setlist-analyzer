# frozen_string_literal: true

require 'blueprinter'

class SetlistBlueprint < Blueprinter::Base
  identifier :id
  fields :name, :genre_name, :rating, :created_at, :updated_at
  field :tracks do |setlist, _options|
    setlist.setlist_tracks.order(:play_order).map do |setlist_track|
      track = setlist_track.track
      track_data = TrackBlueprint.render_as_hash(track, view: :show)
      track_data.merge(play_order: setlist_track.play_order)
    end
  end
end
