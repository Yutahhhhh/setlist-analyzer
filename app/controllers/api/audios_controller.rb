# frozen_string_literal: true

module Api
  class AudiosController < Api::ApplicationController
    def index
      page, per_page, filename, extensions, is_all_tracks = fetch_search_params
      all_files = fetch_audio_files(filename, extensions, is_all_tracks)
      total_count = all_files.count
      paginated_files = paginate_files(all_files, page, per_page)

      tracks = extract_tracks(paginated_files)
      render json: TrackBlueprint.render({
                                           total_item_count: total_count,
                                           total_pages: paginated_files.total_pages,
                                           current_page: paginated_files.current_page,
                                           tracks:
                                         }, view: :list)
    end

    private

    def fetch_search_params
      [
        params[:page] || 1,
        params[:per] || 10,
        params[:filename],
        params[:extensions]&.split(','),
        ActiveModel::Type::Boolean.new.cast(params[:is_all_tracks])
      ]
    end

    def fetch_audio_files(filename, extensions, is_all_tracks)
      AudioUtil.read_audio_directory(
        filename:,
        extensions:,
        exclude_paths: is_all_tracks ? [] : current_user.tracks.pluck(:path)
      )
    end

    def paginate_files(files, page, per_page)
      Kaminari.paginate_array(files).page(page).per(per_page)
    end

    def extract_tracks(paginated_files)
      paginated_files.map { |file| Track.new.fetch(file) }
    end

    def search_params
      params.permit(:page, :per, :filename, :extensions, :is_all_tracks)
    end
  end
end
