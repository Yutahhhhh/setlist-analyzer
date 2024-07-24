# frozen_string_literal: true

module Api
  class AudiosController < Api::ApplicationController
    include Api::Tracks::FetchParams

    def index
      filename, extensions, is_all_tracks = extract_audio_search_params(search_params)
      all_files = fetch_audio_files(filename, extensions, is_all_tracks)
      total_count = all_files.count
      tracks = extract_tracks(all_files)
      render json: TrackBlueprint.render({
                                           total_item_count: total_count,
                                           total_pages: 1,
                                           current_page: 1,
                                           tracks:
                                         }, view: :list)
    end

    private

    def extract_tracks(files)
      files.map { |file| Track.new.fetch(file) }
    end

    def search_params
      params.permit(:filename, :extensions, :is_all_tracks)
    end
  end
end
