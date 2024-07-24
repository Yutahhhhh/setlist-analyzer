# frozen_string_literal: true

require 'blueprinter'

class TrackBlueprint < Blueprinter::Base
  view :show do
    identifier :id
    fields :acousticness,
           :spectral_contrast,
           :duration,
           :energy,
           :genre,
           :spectral_flatness,
           :key,
           :spectral_bandwidth,
           :loudness,
           :lyrics,
           :measure,
           :mode,
           :name,
           :path,
           :mfcc,
           :tempo,
           :time_signature,
           :valence,
           :created_at,
           :updated_at,
           :cover_mime_type,
           :user_id,
           :cover_image_url,
           :md5
  end

  view :with_phrases do
    include_view :show
    field :phrases do |track, options|
      if options[:phrase].present?
        track.track_phrases.map do |phrase|
          TrackPhraseBlueprint.render_as_hash(phrase)
        end
      else
        []
      end
    end
  end

  view :list do
    fields :total_item_count, :total_pages, :current_page
    field :tracks do |v, _options|
      v[:tracks].map do |track|
        TrackBlueprint.render_as_hash(track, view: :show)
      end
    end
  end
end
