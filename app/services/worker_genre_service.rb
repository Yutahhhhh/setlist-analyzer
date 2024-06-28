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

  def self.start_train(file_paths, user_id, is_first_rec)
    tracks = Track.where(path: file_paths).map do |t|
      {
        genre: t.genre, acousticness: t.acousticness, spectral_contrast: t.spectral_contrast,
        energy: t.energy, spectral_flatness: t.spectral_flatness, spectral_bandwidth: t.spectral_bandwidth,
        loudness: t.loudness, mfcc: t.mfcc, valence: t.valence, tempo: t.tempo, duration: t.duration,
        key: t.key, mode: t.mode, time_signature: t.time_signature, measure: t.measure
      }
    end
    headers = { 'Content-Type' => 'application/json' }
    body = {
      tracks:,
      user_id:,
      incremental: is_first_rec ? false : true
    }.to_json
    # 1本のリクエストに3分以上かかる場合、timeoutを180以上に設定
    response = post('/workers/genres/train', body:, headers:, timeout: 180)
    raise WorkerServiceError, "ジャンル学習に失敗しました: #{response.code} - #{response.message}" unless response.ok?

    handle_train_response(response.parsed_response)
  end

  def self.format_genres(data)
    data['genres'].map { |genre| genre }
  end

  def self.handle_train_response(response)
    Rails.logger.debug "結果: #{response['message']}"
    Rails.logger.debug "モデル: #{response['model_path']}"
  end
end
