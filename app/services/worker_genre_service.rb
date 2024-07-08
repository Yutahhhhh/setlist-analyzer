# frozen_string_literal: true

class WorkerGenreService < WorkerService
  def self.get_genres(user_id)
    response = get('/workers/genres/', {
                     query: {
                       user_id:
                     }
                   })
    raise WorkerServiceError, "ジャンルの取得に失敗しました: #{response.code} - #{response.message}" unless response.ok?

    format_genres(response.parsed_response)
  end

  # rubocop:disable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity, Metrics/MethodLength
  def self.start_train(file_paths, user_id, is_first_rec)
    tracks = Track
             .where(path: file_paths)
             .where.not(genre: nil)
             .map do |t|
      {
        genre: t.genre,
        acousticness: t.acousticness || 0.0,
        spectral_contrast: t.spectral_contrast || 0.0,
        energy: t.energy || 0.0,
        spectral_flatness: t.spectral_flatness || 0.0,
        spectral_bandwidth: t.spectral_bandwidth || 0.0,
        loudness: t.loudness || 0.0,
        mfcc: t.mfcc || 0.0,
        valence: t.valence || 0.0,
        tempo: t.tempo || 0.0,
        duration: t.duration || 0.0,
        key: t.key || 0,
        mode: t.mode || 1,
        time_signature: t.time_signature || 0,
        measure: t.measure || 1
      }
    end
    headers = { 'Content-Type': 'application/json' }
    body = {
      tracks:,
      user_id:,
      incremental: !is_first_rec
    }.to_json
    response = post('/workers/genres/train', body:, headers:)
    raise WorkerServiceError, "ジャンル学習に失敗しました: #{response.code} - #{response.message}" unless response.ok?

    handle_train_response(response.parsed_response)
  end
  # rubocop:enable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity, Metrics/MethodLength

  def self.format_genres(data)
    data['genres'].map { |genre| genre }
  end

  def self.handle_train_response(response)
    Rails.logger.debug "結果: #{response['message']}"
    Rails.logger.debug "モデル: #{response['model_path']}"
  end
end
