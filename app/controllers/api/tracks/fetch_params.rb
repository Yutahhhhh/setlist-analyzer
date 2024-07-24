# frozen_string_literal: true

module Api::Tracks::FetchParams
  extend ActiveSupport::Concern

  private

  def exclude_ids
    ex = JobStatus::AudioAnalyzeLyric.latest_running_job&.target || []
    ex += JobStatus::AudioAnalyzeGenre.latest_running_job&.target || []
    ex
  end

  def exclude_paths(is_all_tracks)
    ex = JobStatus::AudioAnalyze.latest_running_job&.target || []
    ex += current_user.tracks.pluck(:path) unless is_all_tracks
    ex
  end

  def extract_track_search_params(target)
    [
      target[:page] || 1,
      target[:per] || 10,
      target[:filename],
      split_param(target[:extensions]),
      split_param(target[:genres]),
      target[:tempo_range] || [],
      ActiveModel::Type::Boolean.new.cast(target[:has_lyric_track])
    ]
  end

  def extract_audio_search_params(target)
    [
      target[:filename],
      target[:extensions]&.split(','),
      ActiveModel::Type::Boolean.new.cast(target[:is_all_tracks])
    ]
  end

  def fetch_audio_files(filename, extensions, is_all_tracks)
    AudioUtil.read_audio_directory(
      filename:,
      extensions:,
      exclude_paths: exclude_paths(is_all_tracks)
    )
  end

  def analyze_tracks(target)
    if target[:analyze_type] == 'ids'
      current_user.tracks.where(id: target[:ids])
    else
      _page, _per_page, filename, extensions, genres, tempo_range, has_lyric_track =
        extract_track_search_params(target[:search_params])
      mime_types = convert_extensions_to_mime_types(extensions)
      current_user.tracks.search(
        filename:,
        mime_types:,
        genres:,
        tempo_range:,
        has_lyric_track:,
        exclude_ids:
      )
    end
  end

  def split_param(param)
    param&.split(',') || []
  end

  def convert_extensions_to_mime_types(extensions)
    extensions.map { |ext| AudioUtil::EXTENSION_TO_MIME_TYPE_MAP[ext] }
  end

  def paginate_tracks(tracks, page, per_page)
    Kaminari.paginate_array(tracks).page(page).per(per_page)
  end
end
