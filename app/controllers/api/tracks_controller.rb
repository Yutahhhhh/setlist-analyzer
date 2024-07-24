# frozen_string_literal: true

module Api
  class TracksController < Api::ApplicationController
    include Api::Tracks::FetchParams
    include Api::Tracks::Job

    def index
      page, per_page, filename, extensions, genres, tempo_range, has_lyric_track =
        extract_track_search_params(search_params)
      mime_types = convert_extensions_to_mime_types(extensions)

      tracks = current_user.tracks.search(
        filename:,
        mime_types:,
        genres:,
        tempo_range:,
        has_lyric_track:,
        exclude_ids:
      )

      paginated_files = paginate_tracks(tracks, page, per_page)

      render json: TrackBlueprint.render({
                                           total_item_count: tracks.count,
                                           total_pages: paginated_files.total_pages,
                                           current_page: paginated_files.current_page,
                                           tracks: paginated_files
                                         }, view: :list)
    end

    def genres
      render json: {
        genres: current_user.tracks.where.not(genre: nil).pluck(:genre).uniq
      }, status: :ok
    end

    def analyze
      filename, extensions, is_all_tracks = extract_audio_search_params(analyze_params)
      files = fetch_audio_files(filename, extensions, is_all_tracks)
      job_status = schedule_audio_analyze_job(files, is_all_tracks)
      render json: JobStatusBlueprint.render(job_status), status: :ok
    end

    def analyze_lyrics
      tracks = analyze_tracks(lyrics_params)
      job_status = schedule_audio_analyze_lyric_job(tracks)
      render json: JobStatusBlueprint.render(job_status), status: :ok
    end

    def analyze_genre
      tracks = analyze_tracks(genre_params)
      job_status = schedule_genre_analyze_job(tracks)
      render json: JobStatusBlueprint.render(job_status), status: :ok
    end

    def destroy_multiple
      Track.transaction do
        track_ids = destroy_multiple_params[:ids]
        current_user.tracks.where(id: track_ids).destroy_all
      end
      render json: {}, status: :ok
    end

    def recommend
      track = current_user.tracks.find(recommend_params[:id])
      tracks = track.recommendations(recommend_params[:weights], recommend_params[:phrase])
      render json: TrackBlueprint.render(tracks, view: :with_phrases, phrase: recommend_params[:phrase]), status: :ok
    end

    private

    def analyze_params
      params.require(:analyze).permit(:filename, :extensions, :is_all_tracks)
    end

    def search_params
      params.permit(:page, :per, :filename, :extensions, :genres, :has_lyric_track, tempo_range: [])
    end

    def lyrics_params
      params.require(:lyrics).permit(:analyze_type, ids: [],
                                                    search_params: [
                                                      :filename, :extensions, :genres, :has_lyric_track,
                                                      { tempo_range: [] }
                                                    ])
    end

    def genre_params
      params.require(:genres).permit(:analyze_type, ids: [],
                                                    search_params: [
                                                      :filename, :extensions, :genres, :has_lyric_track,
                                                      { tempo_range: [] }
                                                    ])
    end

    def recommend_params
      params.permit(:id, :page, :per, :phrase, weights: %i[genre tempo energy valence acousticness loudness])
    end

    def destroy_multiple_params
      params.permit(ids: [])
    end
  end
end
