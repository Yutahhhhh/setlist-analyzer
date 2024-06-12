# frozen_string_literal: true

module Api
  class TracksController < Api::ApplicationController
    def index
      page, per_page, filename, extensions = fetch_search_params
      mime_types = convert_extensions_to_mime_types(extensions)

      tracks = current_user
               .tracks
               .by_filename(filename)
               .by_mime_types(mime_types)

      paginated_files = paginate_tracks(tracks, page, per_page)

      render json: TrackBlueprint.render({
                                           total_item_count: tracks.count,
                                           total_pages: paginated_files.total_pages,
                                           current_page: paginated_files.current_page,
                                           tracks: paginated_files
                                         }, view: :list)
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

    private

    def analyze_params
      params.require(:analyze).permit(:filename, :extensions, :is_all_tracks)
    end

    def search_params
      params.permit(:page, :per, :filename, :extensions)
    end

    def fetch_search_params
      [
        params[:page] || 1,
        params[:per] || 10,
        params[:filename],
        params[:extensions]&.split(',') || []
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
  end
end
