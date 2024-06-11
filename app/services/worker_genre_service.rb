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

  def self.start_train(file_paths, user_id)
    headers = { 'Content-Type' => 'application/json' }
    body = { file_paths:, user_id: }.to_json
    # 1本のリクエストに3分以上かかる場合、timeoutを180以上に設定
    response = post('/workers/genres/train', body:, headers:, timeout: 180)
    raise WorkerServiceError, "ジャンル学習に失敗しました: #{response.code} - #{response.message}" unless response.ok?

    handle_train_response(response.parsed_response)
  end

  def self.delete_genre_model(user_id)
    llm_dir = Rails.application.config.llm_base_dir
    genre_model_path = "#{llm_dir}/#{user_id}/genre_model.pkl"
    File.delete(genre_model_path) if File.exist?(genre_model_path)
  end

  def self.format_genres(data)
    data['genres'].map { |genre| genre }
  end

  def self.handle_train_response(response)
    Rails.logger.debug "学習メッセージ: #{response['message']}"
    Rails.logger.debug "処理済みファイル数: #{response['processed_files']}"
    Rails.logger.debug "スキップされたファイル数: #{response['skipped_files']}"
    return if response['error_files'].empty?

    Rails.logger.debug '問題のあったファイル:'
    response['error_files'].each do |file|
      puts " - #{file}"
    end
  end
end
