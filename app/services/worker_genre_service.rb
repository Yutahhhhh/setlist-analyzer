# frozen_string_literal: true

class WorkerGenreService < WorkerService
  read_timeout 600
  FEATURES = {
    genre: nil,
    acousticness: 0.0,
    spectral_contrast: 0.0,
    energy: 0.0,
    spectral_flatness: 0.0,
    spectral_bandwidth: 0.0,
    loudness: 0.0,
    mfcc: 0.0,
    valence: 0.0,
    tempo: 0.0,
    duration: 0.0,
    key: 0,
    mode: 1,
    time_signature: 0,
    measure: 1
  }.freeze

  def self.get_genres(user_id)
    response = get('/workers/genres/', {
                     query: {
                       user_id:
                     }
                   })
    raise WorkerServiceError, "ジャンルの取得に失敗しました: #{response.code} - #{response.message}" unless response.ok?

    format_genres(response.parsed_response)
  end

  def self.start_train(file_paths, user_id)
    tracks = Track.where.not(genre: nil)
                  .by_paths(file_paths)
                  .map { |track| track_features(track) }
    headers = { 'Content-Type': 'application/json' }
    body = {
      tracks:,
      user_id:
    }.to_json
    response = post('/workers/genres/train', body:, headers:)
    raise WorkerServiceError, "ジャンル学習に失敗しました: #{response.code} - #{response.message}" unless response.ok?

    handle_train_response(response.parsed_response)
  end

  def self.start_predict(file_paths, user_id)
    features = Track.where(path: file_paths)
                    .map do |track|
                      {
                        id: track.id,
                        features: track_features(track)
                      }
                    end
    headers = { 'Content-Type' => 'application/json' }
    body = {
      user_id:,
      tracks: features
    }.to_json
    response = post('/workers/genres/predict', body:, headers:, timeout: 600)

    res = response.parsed_response
    handle_predict_response(res)
    response_predict_format(res)
  end

  def self.track_features(track)
    FEATURES.map do |key, default|
      [key, track.public_send(key) || default]
    end.to_h
  end

  def self.format_genres(data)
    data['genres'].map { |genre| genre }
  end

  def self.handle_train_response(response)
    Rails.logger.debug "結果: #{response['message']}"
    Rails.logger.debug "モデル: #{response['model_path']}"
  end

  def self.handle_predict_response(response)
    Rails.logger.debug "結果: #{response['result']}"
  end

  def self.response_predict_format(data)
    data['results'].map do |result|
      {
        id: result['id'],
        genre: result['genre']
      }
    end
  end
end
