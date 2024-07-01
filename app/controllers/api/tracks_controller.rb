# frozen_string_literal: true

module Api
  class TracksController < Api::ApplicationController
    def index
      page, per_page, filename, extensions, genres, has_lyric_track = fetch_search_params(search_params)
      mime_types = convert_extensions_to_mime_types(extensions)

      tracks = current_user.tracks.search(filename:, mime_types:, genres:, has_lyric_track:)
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
        genres: current_user.tracks.pluck(:genre).uniq
      }, status: :ok
    end

    def analyze
      filename, extensions, is_all_tracks = analyze_params.values_at(:filename, :extensions, :is_all_tracks)
      is_all_tracks = ActiveModel::Type::Boolean.new.cast(is_all_tracks)
      files = AudioUtil.read_audio_directory(
        filename:,
        extensions: extensions&.split(','),
        exclude_paths: is_all_tracks ? [] : current_user.tracks.pluck(:path)
      )

      job_status = schedule_audio_analyze_job(files, is_all_tracks)
      render json: JobStatusBlueprint.render(job_status), status: :ok
    end

    def analyze_lyrics
      if lyrics_params[:analyze_type] == 'ids'
        tracks = current_user.tracks.where(id: lyrics_params[:ids])
      else
        _page, _per_page, filename, extensions, genres, has_lyric_track =
          fetch_search_params(lyrics_params[:search_params])
        mime_types = convert_extensions_to_mime_types(extensions)
        tracks = current_user.tracks.search(filename:, mime_types:, genres:, has_lyric_track:)
      end

      job_status = schedule_audio_analyze_lyric_job(tracks)
      render json: JobStatusBlueprint.render(job_status), status: :ok
    end

    def destroy
      current_user.tracks.where(destroy_params[:ids]).destroy_all
      render json: {}, status: :ok
    end

    private

    def analyze_params
      params.require(:analyze).permit(:filename, :extensions, :is_all_tracks)
    end

    def search_params
      params.permit(:page, :per, :filename, :extensions, :genres, :has_lyric_track)
    end

    def lyrics_params
      params.require(:lyrics).permit(:analyze_type, ids: [],
                                                    search_params: %i[filename extensions genres has_lyric_track])
    end

    def destroy_params
      params.permit(ids: [])
    end

    def fetch_search_params(target)
      [
        target[:page] || 1,
        target[:per] || 10,
        target[:filename],
        target[:extensions]&.split(',') || [],
        target[:genres]&.split(',') || [],
        target[:has_lyric_track] == 'true'
      ]
    end

    def convert_extensions_to_mime_types(extensions)
      extensions.map { |ext| AudioUtil::EXTENSION_TO_MIME_TYPE_MAP[ext] }
    end

    def paginate_tracks(tracks, page, per_page)
      Kaminari.paginate_array(tracks).page(page).per(per_page)
    end

    def process_files(files, is_all_tracks)
      files.each do |file|
        track = Track.find_or_initialize_by(path: file, user_id: current_user.id)
        next if !is_all_tracks && track.persisted?

        track.fetch(file)
        track.save
      end
    end

    def schedule_audio_analyze_job(files, is_all_tracks)
      job_status = JobStatus::AudioAnalyze.new(user_id: current_user.id)
      job_status.prepare!
      AudioAnalyzeJob.perform_async(files, job_status.id, is_all_tracks)
      job_status
    end

    def schedule_audio_analyze_lyric_job(tracks)
      job_status = JobStatus::AudioAnalyzeLyric.new(user_id: current_user.id)
      job_status.prepare!
      AudioAnalyzeLyricJob.perform_async(tracks.pluck(:path), job_status.id)
      job_status
    end
  end
end
