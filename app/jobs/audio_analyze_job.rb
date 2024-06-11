# frozen_string_literal: true

class AudioAnalyzeJob < AudioCableBaseJob
  FILES_PER_BATCH = 5
  CHANNEL_PREFIX = 'audio_analyze_channel'

  def perform(audio_files, job_status_id, is_all_tracks)
    @is_all_tracks = is_all_tracks
    perform_job(audio_files, job_status_id)
  end

  def job_process(files, user_id)
    res = WorkerAnalyzeFeatureService.start_analyze(files, user_id)
    process_results(res, user_id)
  end

  def find_job_status(job_status_id)
    JobStatus::AudioAnalyze.find(job_status_id)
  end

  private

  def process_results(results, user_id)
    results.each do |result|
      track = find_or_initialize_track(result, user_id)
      next if skip_track?(track)

      update_track(track, result)
      track.save!
    end
  end

  def find_or_initialize_track(result, user_id)
    Track.find_or_initialize_by(path: result[:file_path], user_id:)
  end

  def skip_track?(track)
    !@is_all_tracks && track.persisted?
  end

  def update_track(track, result)
    metadata = result[:metadata]
    track.update(
      year: result[:metadata][:year],
      audio_mime_type: result[:audio_mime_type],
      name: File.basename(track.path),
      md5: result[:md5]
    )
    set_metadata(track, result[:metadata])
    set_features(track, result[:features])
    set_artwork(track,  metadata[:artwork], metadata[:art_mime_type])
  end

  def set_metadata(track, metadata)
    track.title = metadata[:title]
    track.artist = metadata[:artist]
    track.album = metadata[:album]
    track.genre = metadata[:genre]
    track
  end

  def set_features(track, features)
    features.each do |feature, value|
      set_feature(track, feature, value)
    end
    track
  end

  def set_feature(track, feature, value)
    case feature
    when :tempo, :key, :mode, :time_signature, :acousticness,
      :spectral_contrast, :energy, :spectral_flatness,
      :spectral_bandwidth, :loudness, :mfcc, :valence, :duration
      track.public_send("#{feature}=", value)
    else
      raise ArgumentError, "Unknown feature: #{feature}"
    end
  end

  def set_artwork(track, artwork, art_mime_type)
    return if artwork.nil? || art_mime_type.nil?

    track.cover_image = AudioUtil.to_uri(art_mime_type, artwork)
    track.cover_mime_type = art_mime_type
  end
end
